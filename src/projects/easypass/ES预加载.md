# 使用Easy-ES将MySQL数据预加载到Elasticsearch

在现代应用中，为了提升搜索性能和提供复杂的查询能力，我们经常将关系型数据库（如MySQL）中的数据同步到搜索引擎（如Elasticsearch）中。一个常见的场景是：在服务启动时，将核心业务数据从数据库全量加载到Elasticsearch中，确保搜索服务的数据是最新的。

本文将通过一个完整的Spring Boot项目，详细演示如何利用`Easy-ES`和`MyBatis-Plus`这两个强大的工具，优雅地实现在服务启动时，自动将MySQL中的`d_program`（节目）表数据预加载到Elasticsearch中。

## 一、 项目整体架构与技术选型

我们的目标是构建一个自动化的数据同步管道。当Spring Boot应用启动时，它会自动连接到MySQL，拉取所有节目数据，然后将这些数据批量索引到Elasticsearch中。

为此，我们选择了以下技术栈：

- **Spring Boot**: 作为项目的基础框架，它极大地简化了配置和开发流程。
- **MyBatis-Plus**: 一个MyBatis的增强工具，它提供了强大的CRUD（增删改查）功能，让我们能用最少的代码操作数据库。
- **Easy-ES**: 一个Elasticsearch的ORM框架，它将操作ES索引的复杂API封装成了类似MyBatis-Plus的Mapper接口，让我们可以像操作数据库一样操作ES。
- **MySQL**: 我们的主数据源，存储着原始的节目信息。
- **Elasticsearch**: 我们的搜索引擎，用于提供高性能的节目搜索服务。

## 二、 Maven依赖管理 (`pom.xml`)

一个项目的起点是它的依赖配置。`pom.xml`文件定义了我们项目所需要的所有“积木”。

```xml
<!-- pom.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.7.5</version>
        <relativePath/>
    </parent>
    <groupId>com.example</groupId>
    <artifactId>es-preload-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>es-preload-demo</name>
    <description>Demo project for preloading data to Elasticsearch using Easy-ES</description>
    <properties>
        <java.version>1.8</java.version>
        <easy-es.version>1.0.2</easy-es.version>
    </properties>
    <dependencies>
        <!-- Spring Boot Web Starter: 提供了Web开发所需的基础环境 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Easy-ES Starter: 这是核心！引入它之后, 我们就可以使用Easy-ES的各种功能了 -->
        <dependency>
            <groupId>cn.easy-es</groupId>
            <artifactId>easy-es-boot-starter</artifactId>
            <version>${easy-es.version}</version>
        </dependency>

        <!-- MyBatis-Plus Starter: 用于简化数据库操作 -->
        <dependency>
            <groupId>com.baomidou</groupId>
            <artifactId>mybatis-plus-boot-starter</artifactId>
            <version>3.5.2</version>
        </dependency>

        <!-- MySQL Connector: Java连接MySQL数据库的驱动 -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok: 一个神奇的工具, 可以通过注解自动生成getter, setter, constructor等代码, 让实体类更简洁 -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>
```

**为什么这么配置？**

- `spring-boot-starter-parent`为我们管理了大量依赖的版本，避免了版本冲突的烦恼。
- `easy-es-boot-starter`和`mybatis-plus-boot-starter`都遵循Spring Boot的“约定大于配置”原则，引入后只需少量配置即可自动装配，极大提升了开发效率。

## 三、 核心代码详解

### 1. 启动类 (`EsPreloadDemoApplication.java`)

这是整个应用的入口，也是配置扫描路径的地方。

```java
// src/main/java/com/example/espreloaddemo/EsPreloadDemoApplication.java
package com.example.espreloaddemo;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 主程序入口
 */
@SpringBootApplication
@MapperScan({"com.example.espreloaddemo.mapper.db", "com.example.espreloaddemo.mapper.es"})
public class EsPreloadDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(EsPreloadDemoApplication.class, args);
    }

}
```

**关键点解读**:

- `@SpringBootApplication`: 一个复合注解，标志着这是一个Spring Boot应用。
- `@MapperScan`: 这个注解至关重要。它告诉Spring框架去哪里寻找我们的Mapper接口。这里我们同时扫描了数据库的Mapper（在`mapper.db`包下）和Elasticsearch的Mapper（在`mapper.es`包下），这样MyBatis-Plus和Easy-ES才能正确地将它们注册为Bean。

### 2. 统一实体类 (`Program.java`)

这是整个数据同步流程的核心模型。我们巧妙地让一个`Program`类同时服务于数据库和Elasticsearch。

```java
// src/main/java/com/example/espreloaddemo/model/Program.java
package com.example.espreloaddemo.model;

import cn.easyes.annotation.IndexField;
import cn.easyes.annotation.IndexName;
import cn.easyes.annotation.IndexSetting;
import cn.easyes.common.constants.Analyzer;
import cn.easyes.common.enums.FieldType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 节目实体类
 * 这个类通过不同的注解, 同时映射了数据库表和ES索引, 这是实现优雅同步的关键。
 */
@Data
@TableName("d_program") // MyBatis-Plus注解: 告诉框架这个类对应数据库中的`d_program`表
@IndexName("program_index") // Easy-ES注解: 指定这个类对应ES中的`program_index`索引
@IndexSetting(shards = 3, replicas = 2) // Easy-ES注解: 可选, 自定义索引的分片和副本数, 提高性能和可用性
public class Program {

    /**
     * 节目ID, 同时作为数据库主键和ES文档ID
     */
    @TableId // Mybatis-Plus主键注解
    private Long id;

    /**
     * 标题 - 需要被搜索和分词
     * @IndexField: Easy-ES的核心注解, 用于定义字段在ES中的属性
     * - fieldType: 设置为TEXT意味着这个字段将被分词, 用于全文搜索。
     * - analyzer: 指定索引时使用的分词器。`ik_max_word`是流行的中文分词器, 会尽可能多地切分词语。
     * - searchAnalyzer: 指定搜索时使用的分词器。`ik_smart`则会做最粗粒度的切分。这种配置在搜索中很常见。
     */
    @IndexField(fieldType = FieldType.TEXT, analyzer = Analyzer.IK_MAX_WORD, searchAnalyzer = Analyzer.IK_SMART)
    private String title;

    /**
     * 艺人 - 通常用于精确匹配或聚合分析
     * KEYWORD类型不分词, 会将整个字段内容作为一个独立的词条。
     */
    @IndexField(fieldType = FieldType.KEYWORD)
    private String actor;

    /**
     * 地点 - 同样需要分词搜索
     */
    @IndexField(fieldType = FieldType.TEXT, analyzer = Analyzer.IK_MAX_WORD)
    private String place;

    /**
     * 项目详情 - 内容可能很长, 但我们不希望它被搜索
     * exist = false 告诉Easy-ES, 这个字段的数据需要存储到ES中(这样查询结果可以返回它), 但不需要为它创建索引。
     * 这样做可以节省存储空间和提高索引速度。
     */
    @IndexField(exist = false)
    private String detail;
    
    // ... 其他字段的注解类似 ...

    @IndexField(fieldType = FieldType.INTEGER)
    private Integer programStatus;

    @IndexField(fieldType = FieldType.DATE)
    private LocalDateTime issueTime;
}
```

**为什么这么设计？**

这种“一个模型，两种用途”的设计极大地减少了代码冗余。我们不需要为数据库和ES分别创建DTO（数据传输对象）并手动转换。MyBatis-Plus和Easy-ES会根据各自的注解，智能地处理这个`Program`对象，一个用于持久化到MySQL，一个用于索引到Elasticsearch。

### 3. Mapper接口 (数据访问层)

这是数据操作的入口，我们定义了两个简单的接口。

- **数据库Mapper (`ProgramDbMapper.java`)**:

  ```java
  // src/main/java/com/example/espreloaddemo/mapper/db/ProgramDbMapper.java
  package com.example.espreloaddemo.mapper.db;
  
  import com.baomidou.mybatisplus.core.mapper.BaseMapper;
  import com.example.espreloaddemo.model.Program;
  
  /**
   * 数据库Mapper (MyBatis-Plus)
   * 继承了BaseMapper后, 就自动拥有了大量的CRUD方法, 无需编写任何SQL。
   */
  public interface ProgramDbMapper extends BaseMapper<Program> {
  }
  ```

- **Elasticsearch Mapper (`ProgramEsMapper.java`)**:

  ```java
  // src/main/java/com/example/espreloaddemo/mapper/es/ProgramEsMapper.java
  package com.example.espreloaddemo.mapper.es;
  
  import cn.easyes.core.core.BaseEsMapper;
  import com.example.espreloaddemo.model.Program;
  
  /**
   * Elasticsearch Mapper (Easy-ES)
   * 同样, 继承BaseEsMapper后, 就拥有了对ES索引的增删改查、创建索引等所有常用操作。
   */
  public interface ProgramEsMapper extends BaseEsMapper<Program> {
  }
  ```

**这种设计的好处？**

极致的简洁！我们不需要编写任何XML或SQL语句，也不需要和复杂的Elasticsearch REST客户端打交道。所有的操作都被封装在了这两个Mapper接口中，调用它们的方法就像调用本地方法一样简单。

### 4. 核心逻辑：数据初始化服务 (`DataInitializationService.java`)

这是实现我们“启动时预加载”需求的核心。

```java
// src/main/java/com/example/espreloaddemo/service/DataInitializationService.java
package com.example.espreloaddemo.service;

import com.example.espreloaddemo.mapper.db.ProgramDbMapper;
import com.example.espreloaddemo.mapper.es.ProgramEsMapper;
import com.example.espreloaddemo.model.Program;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import java.util.List;

/**
 * 数据初始化服务
 * 实现 CommandLineRunner 接口是Spring Boot提供的一个便捷方式,
 * 它能保证run方法在所有Bean都加载完成, 应用启动之后自动执行一次。
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DataInitializationService implements CommandLineRunner {

    private final ProgramDbMapper programDbMapper;
    private final ProgramEsMapper programEsMapper;

    @Override
    public void run(String... args) {
        log.info("================== [开始] 数据预加载任务 ==================");

        // 步骤1: 检查并创建索引, 保证程序的健壮性
        // 如果索引不存在就直接写入数据, ES会报错。所以先检查, 没有就创建一个。
        // Easy-ES会根据Program实体类上的注解自动创建正确的mapping。
        boolean exists = programEsMapper.existsIndex();
        if (!exists) {
            log.warn("Elasticsearch 索引 'program_index' 不存在, 正在创建...");
            if (programEsMapper.createIndex()) {
                log.info("索引 'program_index' 创建成功.");
            } else {
                log.error("索引 'program_index' 创建失败! 任务终止。");
                return;
            }
        } else {
            log.info("Elasticsearch 索引 'program_index' 已存在, 无需创建.");
        }

        // 步骤2: 从数据库查询所有节目数据
        // programDbMapper.selectList(null) 会查询d_program表中的所有数据。
        // 注意：在生产环境中, 如果数据量巨大(例如百万级别), 应该采用分页查询的方式,
        // 否则可能一次性加载过多数据到内存导致OOM(内存溢出)。
        log.info("正在从数据库查询节目数据...");
        List<Program> programList = programDbMapper.selectList(null);

        if (CollectionUtils.isEmpty(programList)) {
            log.warn("数据库中没有节目数据, 无需加载.");
            log.info("================== [结束] 数据预加载任务 ==================");
            return;
        }
        log.info("从数据库成功查询到 {} 条节目数据.", programList.size());

        // 步骤3: 批量插入数据到Elasticsearch
        // 使用insertBatch方法可以显著提高写入性能, 它会将多条数据合并为一次请求发送给ES,
        // 远比一条一条插入要快得多。
        log.info("正在将数据批量写入 Elasticsearch...");
        int successCount = programEsMapper.insertBatch(programList);

        if (successCount > 0) {
            log.info("成功将 {} 条数据写入 Elasticsearch.", successCount);
        } else {
            log.error("数据写入 Elasticsearch 失败!");
        }

        log.info("================== [结束] 数据预加载任务 ==================");
    }
}
```

## 四、 配置文件 (`application.yml`)

最后，我们需要一个配置文件来告诉应用如何连接数据库和Elasticsearch。

```yaml
# src/main/resources/application.yml

# 服务器端口
server:
  port: 8080

# Spring 应用名称
spring:
  application:
    name: es-preload-demo
  # 数据库数据源配置
  datasource:
    url: jdbc:mysql://localhost:3306/your_database?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai
    username: your_username
    password: your_password
    driver-class-name: com.mysql.cj.jdbc.Driver

# Easy-ES 配置
easy-es:
  # Elasticsearch 地址, 如果是集群, 多个用逗号隔开, 例如: 192.168.1.1:9200,192.168.1.2:9200
  address: 127.0.0.1:9200
  # 如果你的ES设置了用户名和密码, 在这里配置
  # username: elastic
  # password: changeme

# MyBatis-Plus 配置
mybatis-plus:
  configuration:
    # 开启驼峰命名转换: 将数据库的下划线命名(create_time)自动转换为Java的驼峰命名(createTime)
    map-underscore-to-camel-case: true
```

将配置信息外部化是最佳实践，这使得我们的应用在不同环境（开发、测试、生产）中部署时，无需修改任何代码，只需更改配置文件即可。

## 五、 总结与运行

至此，我们已经构建了一个完整的、自动化的数据预加载系统。当您运行这个Spring Boot应用时：

1. `DataInitializationService`作为`CommandLineRunner`会被触发。
2. 它首先通过`ProgramEsMapper`检查并确保Elasticsearch中存在名为`program_index`的索引。
3. 然后，通过`ProgramDbMapper`从MySQL的`d_program`表中拉取所有数据。
4. 最后，调用`ProgramEsMapper`的`insertBatch`方法，将所有节目数据高效地写入Elasticsearch。

整个过程清晰、自动化且代码优雅。这得益于Spring Boot的自动装配机制，以及MyBatis-Plus和Easy-ES强大的封装能力，它们将复杂的底层实现隐藏起来，让我们可以更专注于业务逻辑本身。