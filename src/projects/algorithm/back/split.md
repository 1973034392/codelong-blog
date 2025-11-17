---
title: 微服务的拆分
---
## 微服务的拆分

> 因为这部分内容太多又很重复,而且比较复杂,所以这里将不说明具体的拆分步骤,大体内容如下:
>
> 	1. 新建模块
> 	1. 复制yml配置并修改相关内容
> 	1. 拆分pom文件依赖
> 	1. 复制相关Controller,Service,Mapper
> 	1. 将相关的实体类复制到common模块下
> 	1. 添加服务注册依赖和相关配置

拆分以后的项目说明:

![PixPin_2025-02-26_18-51-31](https://pic.codelong.top/PicGo/PixPin_2025-02-26_18-51-31.png)

我将项目拆分为了几个模块:

* common - 存放通用的一些文件,例如相关配置,常量,异常信息,全局异常处理器,结果类等等 

* contest-service - 负责比赛相关接口

  ![PixPin_2025-02-26_19-55-01](https://pic.codelong.top/PicGo/PixPin_2025-02-26_19-55-01.png)

* feign-service - 负责远程feign调用,为了降低开发难度,我选择提高一些耦合度来进行更简便的开发

* gateway-service - 负责网关的实现,用户登录的验证

* judge-service - 判题模块,负责判题和返回判题相关接口,以后会对这部分模块进行优化

  ![PixPin_2025-02-26_19-55-35](https://pic.codelong.top/PicGo/PixPin_2025-02-26_19-55-35.png)

* problem-service - 问题模块,负责问题的查询等等功能

  ![PixPin_2025-02-26_19-55-56](https://pic.codelong.top/PicGo/PixPin_2025-02-26_19-55-56.png)

* user-service - 用户模块,负责用户相关接口的实现

![PixPin_2025-02-26_19-56-07](https://pic.codelong.top/PicGo/PixPin_2025-02-26_19-56-07.png)

**特别说明:本次拆分只是暂时的,未来将对这些模块做进一步优化和处理**



在根项目的pom文件对整个项目的依赖做了管理:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>

    <groupId>com.codelong</groupId>
    <artifactId>backend</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>pom</packaging>
    <name>backend</name>
    <description>backend</description>
    <url/>
    <licenses>
        <license/>
    </licenses>
    <developers>
        <developer/>
    </developers>
    <modules>
        <module>user-service</module>
        <module>problem-service</module>
        <module>contest-service</module>
        <module>judge-service</module>
        <module>common</module>
    </modules>
    <scm>
        <connection/>
        <developerConnection/>
        <tag/>
        <url/>
    </scm>
    <properties>
        <java.version>17</java.version>
        <!-- 统一依赖版本 -->
        <fastjson.version>2.0.52</fastjson.version>
        <druid.version>1.2.15</druid.version>
        <knife4j.version>4.4.0</knife4j.version>
        <httpclient.version>4.5.14</httpclient.version>
        <obs.version>3.24.3</obs.version>
        <jwt.version>4.3.0</jwt.version>
        <mybatis-plus.version>3.5.7</mybatis-plus.version>
        <nacos-discovery>2023.0.1.2</nacos-discovery>
    </properties>

    <dependencyManagement>
        <dependencies>
            <!-- 第三方依赖版本管理 -->
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>fastjson</artifactId>
                <version>${fastjson.version}</version>
            </dependency>
            <dependency>
                <groupId>com.alibaba</groupId>
                <artifactId>druid</artifactId>
                <version>${druid.version}</version>
            </dependency>
            <dependency>
                <groupId>com.github.xiaoymin</groupId>
                <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
                <version>${knife4j.version}</version>
            </dependency>
            <dependency>
                <groupId>org.apache.httpcomponents</groupId>
                <artifactId>httpclient</artifactId>
                <version>${httpclient.version}</version>
            </dependency>
            <dependency>
                <groupId>com.huaweicloud</groupId>
                <artifactId>esdk-obs-java-bundle</artifactId>
                <version>${obs.version}</version>
            </dependency>
            <dependency>
                <groupId>com.auth0</groupId>
                <artifactId>java-jwt</artifactId>
                <version>${jwt.version}</version>
            </dependency>
            <dependency>
                <groupId>com.baomidou</groupId>
                <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
                <version>${mybatis-plus.version}</version>
            </dependency>
            <dependency>
                <groupId>com.alibaba.cloud</groupId>
                <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
                <version>${nacos-discovery}</version>
            </dependency>

            <!-- 公共模块依赖 -->
            <dependency>
                <groupId>${project.groupId}</groupId>
                <artifactId>common</artifactId>
                <version>${project.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>

</project>

```

## nacos的配置

在项目xml中做了版本管理以后,添加下面依赖和配置项:

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

```yml
spring:
  application:
    name: problem-service
  cloud:
    nacos:
      server-addr: 192.168.154.128:8848
```

然后启动该服务:

![PixPin_2025-02-26_19-05-02](https://pic.codelong.top/PicGo/PixPin_2025-02-26_19-05-02.png)

## 特别说明

这次的改动是暂时的,未来将对各模块做对应的解耦和优化,可以查看2025.02.26的第一次提交来获取相关改动



## 网关相关配置

在项目pom文件配置了版本信息之后,添加以下依赖和配置项

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-loadbalancer</artifactId>
</dependency>
```

```yml
server:
  port: 8080
spring:
  application:
    name: gateway-service
  cloud:
    nacos:
      server-addr: 192.168.154.128:8848
    gateway:
      routes:
        - id: user # 路由规则id，自定义，唯一
          uri: lb://user-service # 路由的目标服务，lb代表负载均衡，会从注册中心拉取服务列表
          predicates: # 路由断言，判断当前请求是否符合当前规则，符合则路由到目标服务
            - Path=/login,/login/**,/avatarUpload,/user/**,/monthRank,/queryAnnouncement # 这里是以请求路径作为判断规则
        - id: problem
          uri: lb://problem-service
          predicates:
            - Path=/tag/query,/problem,/problem/**,/problemList,/problemList/**
        - id: judge
          uri: lb://judge-service
          predicates:
            - Path=/judge,/record/**
        - id: contest
          uri: lb://contest-service
          predicates:
            - Path=/contest,/contest/**
```

* **网关集成登录校验**

  在路由模块添加配置

  ```java
  @Data
  @Component
  @ConfigurationProperties(prefix = "hm.auth")
  public class AuthProperties {
      private List<String> includePaths;
      private List<String> excludePaths;
  }
  ```

  实现自定义拦截器

  ```java
  package com.codelong.filter;
  
  import com.auth0.jwt.interfaces.Claim;
  import com.codelong.config.AuthProperties;
  import com.codelong.utils.JwtUtils;
  import lombok.RequiredArgsConstructor;
  import lombok.extern.slf4j.Slf4j;
  import org.springframework.cloud.gateway.filter.GatewayFilterChain;
  import org.springframework.cloud.gateway.filter.GlobalFilter;
  import org.springframework.core.Ordered;
  import org.springframework.http.server.reactive.ServerHttpRequest;
  import org.springframework.http.server.reactive.ServerHttpResponse;
  import org.springframework.stereotype.Component;
  import org.springframework.util.AntPathMatcher;
  import org.springframework.web.server.ServerWebExchange;
  import reactor.core.publisher.Mono;
  
  import java.util.List;
  import java.util.Map;
  
  @Component
  @RequiredArgsConstructor
  @Slf4j
  public class LoginGlobalFilter implements GlobalFilter, Ordered {
  
      private final AuthProperties authProperties;
      private final AntPathMatcher antPathMatcher = new AntPathMatcher();
  
      @Override
      public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
          ServerHttpRequest request = exchange.getRequest();
  
          if(isExclude(request.getPath().toString())){
              // 无需拦截，直接放行
              return chain.filter(exchange);
          }
  
          List<String> headers = request.getHeaders().get("Authorization");
          if (headers != null && !headers.isEmpty()) {
              String token = headers.get(0);
              if (JwtUtils.verify(token)) {
                  Map<String, Claim> claims = JwtUtils.getClaims(token);
                  Claim id = claims.get("id");
                  ServerWebExchange ex = exchange.mutate()
                          .request(b -> b.header("userId", id.asLong().toString()))
                          .build();
                  return chain.filter(ex);
              }
          }
          log.info("未登录用户请求已被拦截  {}", request.getPath());
          ServerHttpResponse response = exchange.getResponse();
          response.setRawStatusCode(401);
          return response.setComplete();
      }
  
      private boolean isExclude(String antPath) {
          for (String pathPattern : authProperties.getExcludePaths()) {
              if(antPathMatcher.match(pathPattern, antPath)){
                  return true;
              }
          }
          return false;
      }
  
      @Override
      public int getOrder() {
          return 0;
      }
  }
  ```

  添加排除路径

  ```yml
  auth:
    excludePaths: # 无需登录校验的路径
      - /login/*
      - /login
  ```

  > 因为需要在网关层解决跨域问题,所以将原来的mvc拦截器删除,增加了网关的拦截

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:5173");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
```

在网关之后添加mvc层来获取响应头中的userId信息并保存到threadlocal里

```java
@Component
@Slf4j
public class LoginCheckInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String userId = request.getHeader("userId");
        if (userId != null && !userId.isEmpty()) {
            CurrentIdUtils.setCurrentId(Long.parseLong(userId));
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        CurrentIdUtils.removeCurrentId();
    }
}
```



## feign的相关配置

> 我已将需要用到的feign接口提出来了,下面是相关的client的配置

```java
@FeignClient(value = "judge-service")
public interface JudgeClient {
    @GetMapping("/record/getSubmissions")
    List<Submission> getSubmissions(@RequestParam("id") Long id, @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime, @RequestParam("endTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime, @RequestParam("subId") Long subId);

    @GetMapping("/record/getScore")
    List<Integer> getScore(@RequestParam("userId") Long userId, @RequestParam("problemId") Long problemId, @RequestParam("startTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime, @RequestParam("endTime") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime);

    @GetMapping("/record/monthRank")
    ArrayList<Map.Entry<Long, Long>> monthRank();
}
```

```java
@FeignClient(value = "problem-service")
public interface ProblemClient {
    @GetMapping("/problem/getDetail")
    Problem problemDetail(@RequestParam("id")Long id);

    @GetMapping("/problem/listByIds")
    List<Problem> list(@RequestParam("ids")List<Long> ids);
}
```

```java
@FeignClient(value = "user-service")
public interface UserClient {
    @GetMapping("/user/getDetail")
    User getById(@RequestParam("id")Long id);

}
```

> 为feign配置连接池

引入依赖

在`pom.xml`中引入依赖：

```XML
<!--OK http 的依赖 -->
<dependency>
  <groupId>io.github.openfeign</groupId>
  <artifactId>feign-okhttp</artifactId>
</dependency>
```

开启连接池

在`application.yml`配置文件中开启Feign的连接池功能：

```YAML
feign:
  okhttp:
    enabled: true # 开启OKHttp功能
```

## 一个小bug

> feign在调用时需要用Jackson对对象序列化,在这个过程中可能会和lombok注解有冲突,具体如下:

Jackson在反序列化User对象时找不到合适的构造方法导致的。以下是解决方案步骤：

* 添加默认构造方法：

  ```java
  @NoArgsConstructor // 添加这个注解生成默认构造器
  public class User {
      // 原有字段和构造器...
  }
  ```

* 如果使用不可变对象，添加@JsonCreator：

  ```java
  public class User {
      private final Long id;
      private final String nickname;
  
      @JsonCreator
      public User(@JsonProperty("id") Long id, 
                  @JsonProperty("nickname") String nickname) {
          this.id = id;
          this.nickname = nickname;
      }
  }
  ```

> **特别注意:** 为了避免feign发起远程调用时因为时间格式的问题导致序列化失败导致的接口不可用,现将原来的时间格式序列化器删除,改为在前端修改时间格式

## 添加mq监听

### 判题后AcNumber等参数监听

```java
@Component
@RequiredArgsConstructor
public class IncreaseListener {
    private final ProblemService problemService;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "problem.increase.queue",durable = "true"),
            exchange = @Exchange(name = "problem.direct"),
            key = "problem.increase"
    ))
    public void increase(String s) {
        IncreaseDTO dto = JSON.parseObject(s,IncreaseDTO.class);
        if (dto.getFull().equals(dto.getScore())) {
            problemService.increaseAC(dto.getId());
        } else {
            problemService.increase(dto.getId());
        }
    }
}
```



### 比赛题目提交监听

```java
@Component
@RequiredArgsConstructor
public class ContestSubListener {

    private final ContestProblemService contestProblemService;
    private final ContestUserService contestUserService;
    private final ContestService contestService;
    private final JudgeClient judgeClient;

    @RabbitListener(bindings = @QueueBinding(
            value = @Queue(name = "contest.handleSub.queue", durable = "true"),
            exchange = @Exchange(name = "contest.direct"),
            key = "contest.handleSub"
    ))
    public void handleSub(String s) {
        HandleSubDTO dto = JSON.parseObject(s,HandleSubDTO.class);
        Problem problem = dto.getProblem();
        Submission submission = dto.getSubmission();

        //获取相关的比赛ID
        List<Long> contestIds = contestProblemService.lambdaQuery()
                .select(ContestProblem::getContestId)
                .eq(ContestProblem::getProblemId, problem.getId())
                .list()
                .stream().map(ContestProblem::getContestId).toList();

        //健壮性判断
        if (contestIds.isEmpty()) {
            return;
        }

        for (Long contestId : contestIds) {
            //判断这个用户是否在比赛用户表中
            boolean exists = contestUserService.lambdaQuery()
                    .eq(ContestUser::getContestId, contestId)
                    .eq(ContestUser::getUserId, CurrentIdUtils.getCurrentId())
                    .exists();

            //获取这个比赛
            Contest contest = contestService.getById(contestId);

            //判断比赛时间
            if (contest.getEndTime().isBefore(LocalDateTime.now())) {
                continue;
            }

            if (exists) {
                //根据比赛ID和用户ID获取相关的比赛用户
                ContestUser user = contestUserService.lambdaQuery()
                        .eq(ContestUser::getContestId, contestId)
                        .eq(ContestUser::getUserId, CurrentIdUtils.getCurrentId())
                        .one();

                //查询这个比赛的这个题目的提交记录(比赛时间判定)
                List<Submission> submissions = judgeClient.getSubmissions(problem.getId(), contest.getStartTime(), contest.getEndTime(), submission.getId());
                //获取以前提交记录的最大分数
                int i = 0;
                for (Submission sub : submissions) {
                    i = Integer.max(i, sub.getJudgeScore());
                }

                //更新比赛用户的分数
                if (submission.getJudgeScore() > i) {
                    user.setScore(user.getScore() + (submission.getJudgeScore() - i));
                }

                //更新AC数
                if (submission.getJudgeScore() == 100 && i != 100) {
                    user.setAcNumber(user.getAcNumber() + 1);
                }

                //更新数据库
                user.setUpdateTime(LocalDateTime.now());
                contestUserService.updateById(user);
            } else {
                //判断比赛是否进行
                if (contest.getEndTime().isAfter(LocalDateTime.now())) {
                    //加入该用户,更新分数
                    contestUserService.save(ContestUser.builder()
                            .userId(CurrentIdUtils.getCurrentId())
                            .contestId(contestId)
                            .acNumber(submission.getJudgeScore() == 100 ? 1 : 0)
                            .status(1)
                            .score(submission.getJudgeScore())
                            .build());
                }
            }

        }
    }
}
```

## nacos配置共享

在nacos添加如下配置:

![PixPin_2025-02-28_17-28-47](https://pic.codelong.top/PicGo/PixPin_2025-02-28_17-28-47.png)

![PixPin_2025-02-28_17-29-30](https://pic.codelong.top/PicGo/PixPin_2025-02-28_17-29-30.png)

然后再引入依赖

```xml
  <!--nacos配置管理-->
  <dependency>
      <groupId>com.alibaba.cloud</groupId>
      <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
  </dependency>
  <!--读取bootstrap文件-->
  <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-starter-bootstrap</artifactId>
  </dependency>
```

在resource目录下添加bootstrap.yml文件

然后添加以下配置

```yml
spring:
  application:
    name: judge-service
  cloud:
    nacos:
      server-addr: 192.168.154.128:8848
      config:
        file-extension: yaml
        shared-configs:
          - data-id: shared-jdbc.yaml
          - data-id: shared-mq.yaml
          - data-id: shared-swagger.yaml
          - data-id: shared-redis.yaml
          - data-id: private-judge.yaml
```

最后更改原配置文件为

```java
server:
  port: 8082
feign:
  okhttp:
    enabled: true
```

> **注:** 在使用配置中心时遇到了很多问题,最后发现是依赖之间的版本冲突
>
> 所以我将项目版本信息做了重构  内容如下:
>
> * jdk版本改为`11`并重构了toList方法
> * springboot版本改为`2.7.12`
> * knife4j版本改为`4.1.0`的`openapi2`实现
> * lombok版本改为`1.18.20`
> * mp版本改为`3.4.3`的`mybatis-plus-boot-starter`版本并对exist等方法做了适配
> * nacos版本改为`2023.0.1.3`
> * spring-cloud和spring-cloud-alibaba分别改为`2021.0.3`和`2021.0.4.0`

**至此,微服务拆分以及完成**



## 添加题目

我在测试类使用了测试方法添加题目和测试点,先加了@Transactional注解来检查有没有错误,然后去掉@Transactional注解后执行插入操作(在test方法默认执行完成后会回滚)

>  实体类:

```java
@Data
public class CodeTemplates {
    private String code;

    private String language;
}

@Data
public class Problem {

    private int auth;

    private String author;

    private boolean isRemote;

    private String problemId;

    private String description;

    private String source;

    private String title;

    private int type;

    private int timeLimit;

    private int memoryLimit;

    private String input;

    private String output;

    private int difficulty;

    private String examples;

    private int ioScore;

    private boolean codeShare;

    private String hint;

    private boolean isRemoveEndBlank;

    private boolean openCaseResult;

    private String judgeCaseMode;

    private boolean isFileIO;

    private String ioReadFileName;

    private String ioWriteFileName;
}

@Data
@ToString
public class Root {
    private String judgeMode;

    private List<String> languages;

    private List<Samples> samples;

    private List<String> tags;

    private Problem problem;

    private List<CodeTemplates> codeTemplates;
}

@Data
public class Samples {
    private String input;

    private String output;
}
```

> 具体代码

```java
@RequiredArgsConstructor
@Data
@Slf4j
@SpringBootTest(classes = ProblemApplication.class)
public class test {
    @Resource
    private ProblemService problemService;

    @Resource
    private JudgePointService judgePointService;

    @Test
//    @Transactional
    void insert() throws IOException {
        Path basePath = Paths.get("C:\\Users\\Administrator\\Desktop\\新OJ题库\\全部题目\\problem");

        List<Path> paths = Files.list(basePath).collect(Collectors.toList());
        for (Path path : paths) {
            Problem problem = new Problem();
            problem.setTitle("1");
            problem.setStatus(1);
            problem.setTimeLimit(100);
            problem.setMemoryLimit(100);
            problem.setStackLimit(100);
            problem.setDifficulty(1);
            problemService.save(problem);
            List<Path> collect = Files.list(path).collect(Collectors.toList());
            for (Path pt : collect) {
                if (Files.isRegularFile(pt)) {
                    String contest = Files.readString(pt, StandardCharsets.UTF_8);
                    Root root = JSON.parseObject(contest, Root.class);
                    handleRoot(root, path, problem);
                }
            }
        }
    }

    private void handleRoot(Root root, Path path, Problem problem) throws IOException {
        problem.setTitle(root.getProblem().getTitle());
        problem.setStatus(1);
        problem.setTimeLimit(root.getProblem().getTimeLimit());
        problem.setMemoryLimit(root.getProblem().getMemoryLimit());
        problem.setStackLimit(64000);
        problem.setDifficulty(root.getProblem().getDifficulty());
        problem.setDetail(setDetail(root.getProblem()));
        problemService.updateById(problem);

        List<Path> collect = Files.list(path).collect(Collectors.toList());
        for (Path pt : collect) {
            if (!Files.isRegularFile(pt)) {
                List<Path> textPath = Files.list(pt).collect(Collectors.toList());
                int size = textPath.size() / 2;
                for (int i = 1; i <= size; i++) {
                    String input = Files.readString(Paths.get(pt.toString() + "\\" + i + ".in"), StandardCharsets.UTF_8);
                    String output = Files.readString(Paths.get(pt.toString() + "\\" + i + ".out"), StandardCharsets.UTF_8);
                    JudgePoint judgePoint = new JudgePoint();
                    judgePoint.setProblemId(problem.getId());
                    judgePoint.setInput(input);
                    judgePoint.setOutput(output);
                    judgePointService.save(judgePoint);
                }
            }
        }
    }

    private String setDetail(com.codelong.domain.Problem problem) {
        StringBuilder md = new StringBuilder();


        md.append("## 题目描述\n\n").append(problem.getDescription()).append("\n\n");
        md.append("## 输入格式\n\n").append(problem.getInput()).append("\n\n");

        String problemOutput = problem.getOutput();
        String finOutput = problemOutput
                .replaceAll("[\\n\\t]+", "\n\n")  // 替换连续换行和制表符为两个换行
                .replaceAll("\n{3,}", "\n\n");    // 防止出现三个以上换行
        md.append("## 输出格式\n\n")
                .append(finOutput.trim())     // 去除首尾空白
                .append("\n\n");

        Pattern pattern = Pattern.compile(
                "<input>(.*?)</input><output>(.*?)</output>",
                Pattern.DOTALL  // 支持跨行匹配
        );
        Matcher matcher = pattern.matcher(problem.getExamples());
        int exampleCount = 0;

        while (matcher.find()) {
            exampleCount++;
            md.append("## 样例 #").append(exampleCount).append("\n\n");
            md.append("### 样例输入 #").append(exampleCount).append("\n\n```\n")
                    .append(matcher.group(1).trim()).append("\n```\n\n");
            md.append("### 样例输出 #").append(exampleCount).append("\n\n```\n")
                    .append(matcher.group(2).trim()).append("\n```\n\n");
        }

        if (!problem.getHint().isEmpty()) {
            md.append("## 提示\n\n").append(problem.getHint()).append("\n\n");
        }
        return md.toString();
    }
}
```

## 配置Redisson分布式锁

> 为了避免一个用户在同一时间多次提交,所以在判题模块添加分布式锁来限制用户多次提交

1. 先添加依赖项: 

   ```xml
   <dependency>
   	<groupId>org.redisson</groupId>
   	<artifactId>redisson</artifactId>
   	<version>3.13.6</version>
   </dependency>
   ```

2. 添加配置类

   ```java
   @Configuration
   public class RedissonConfig {
   
       @Bean
       public RedissonClient redissonClient() {
           Config config = new Config();
           config.useSingleServer().setAddress("redis://localhost:6379").setDatabase(5);
           return Redisson.create(config);
       }
   }
   ```

3. 添加锁的处理逻辑

   ```java
   RLock lock = redissonClient.getLock("JudgeLock: " + CurrentIdUtils.getCurrentId());
   boolean isLock = lock.tryLock(0,5,TimeUnit.SECONDS);
   if (!isLock) {
       return -1L;
   }
   //获取题目信息
   Problem problem = problemClient.problemDetail(judgeDTO.getProblemId());
   List<JudgePoint> list = judgePointService.lambdaQuery().
       eq(JudgePoint::getProblemId, judgeDTO.getProblemId()).
       list();
   
   CopyOnWriteArrayList<JudgePoint> judgePointList = new CopyOnWriteArrayList<>(list);
   
   //设置latch便于等待多线程判题结束
   CountDownLatch latch = new CountDownLatch(judgePointList.size());
   
   //保存本次提交记录,获取id
   Submission submission = new Submission();
   submission.setCreateTime(LocalDateTime.now());
   submission.setUserId(CurrentIdUtils.getCurrentId());
   submission.setProblemId(judgeDTO.getProblemId());
   submissionService.save(submission);
   
   //设置判题限制
   JudgeDomain dto = JudgeDomain.builder()
       .source_code(judgeDTO.getCode())
       .language_id(judgeDTO.getLanguage())
       .memory_limit(problem.getMemoryLimit() * 1024)
       .stack_limit(problem.getStackLimit())
       .cpu_time_limit(problem.getTimeLimit() / 1000.0)
       .build();
   
   //创建判题结果队列
   CopyOnWriteArrayList<JudgeResult> results = new CopyOnWriteArrayList<>();
   
   //创建连接失败标志
   AtomicBoolean connectError = new AtomicBoolean(false);
   
   //开始判题
   try {
       for (JudgePoint judgePoint : judgePointList) {
           executor.execute(() -> {
               try {
                   JudgeResult result = simpleJudge(dto, judgePoint.getInput(), judgePoint.getOutput());
                   //设置测试点id和测试点输入值
                   result.setPointId(judgePoint.getId());
                   result.setInput(judgePoint.getInput());
                   results.add(result);
               } catch (Exception e) {
                   connectError.set(true);
               } finally {
                   latch.countDown();
               }
           });
       }
       latch.await();
   } catch (Exception e) {
       throw new RuntimeException(e);
   } finally {
       lock.unlock();
   }
   ```

最终效果如图所示:

![PixPin_2025-03-22_14-29-21](https://pic.codelong.top/PicGo/PixPin_2025-03-22_14-29-21.png)

## 无效token判断

> 这里选用redisson的布隆过滤器来实现

```java
@Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        if (isExclude(request.getPath().toString())) {
            // 无需拦截，直接放行
            return chain.filter(exchange);
        }

        List<String> headers = request.getHeaders().get("Authorization");
        String token = null;
        if (headers != null && !headers.isEmpty()) {
            token = headers.get(0);
        }

        RBloomFilter<Object> bloomFilter = redissonClient.getBloomFilter("JWTFilter");
        bloomFilter.tryInit(10000, 0.05);
        boolean contains = bloomFilter.contains(token);
        String value = redisTemplate.opsForValue().get("expireToken:" + token);

        if (value != null) {
            contains = true;
        }
        if(contains){
            log.info("未登录用户请求已被拦截  {}", request.getPath());
            ServerHttpResponse response = exchange.getResponse();
            response.setRawStatusCode(401);
            return response.setComplete();
        }

        if (JwtUtils.verify(token)) {
            Map<String, Claim> claims = JwtUtils.getClaims(token);
            Claim id = claims.get("id");
            ServerWebExchange ex = exchange.mutate()
                    .request(b -> b.header("userId", id.asLong().toString()))
                    .build();
            return chain.filter(ex);
        }
        log.info("未登录用户请求已被拦截  {}", request.getPath());
        ServerHttpResponse response = exchange.getResponse();
        response.setRawStatusCode(401);
        return response.setComplete();
    }
```

```java
//添加登出接口
@Override
public void logout(String token) {
    if(token != null){
        redisTemplate.opsForValue().set("expireToken:" + token, "1",JwtUtils.TOKEN_EXPIRE_TIME, TimeUnit.MILLISECONDS);
        RBloomFilter<Object> bloomFilter = redissonClient.getBloomFilter("JWTFilter");
        bloomFilter.tryInit(10000, 0.05);
        bloomFilter.add(token);
    }
}
```

