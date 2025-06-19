# Spring

## 常用注解有哪些?

|    **类别**    |               **注解**               |      **说明**      |       **典型应用场景**       |
| :------------: | :----------------------------------: | :----------------: | :--------------------------: |
| **Spring核心** |             `@Component`             |    通用组件标记    |       工具类、通用组件       |
|                |            `@Controller`             |   MVC控制器标记    |        Web请求处理层         |
|                |              `@Service`              |   业务逻辑层标记   |        业务逻辑实现类        |
|                |             `@Autowired`             |    自动依赖注入    |         注入Bean依赖         |
|                |             `@Qualifier`             |   按名称限定注入   |     多实现类指定具体Bean     |
|                |               `@Value`               |     注入配置值     | 读取application.properties值 |
| **Spring MVC** |          `@RequestMapping`           |  请求映射基础注解  |    REST控制器入口（旧版）    |
|                |            `@GetMapping`             |  专门处理GET请求   |         资源查询接口         |
|                |            `@PostMapping`            |  专门处理POST请求  |         创建资源接口         |
|                |           `@PathVariable`            |  获取URL路径参数   |     RESTful资源路径参数      |
|                |           `@RequestParam`            |    获取请求参数    |         查询参数获取         |
|                |            `@RequestBody`            |   绑定请求体数据   |      JSON/XML请求体解析      |
|                |           `@ResponseBody`            |   响应体数据返回   |         返回JSON数据         |
|                |       `@RestControllerAdvice`        | 定义全局异常处理器 |         接收处理异常         |
|                | `@ExceptionHandler(Exception.class)` | 定义异常处理器逻辑 |           处理异常           |
| **Spring事务** |           `@Transactional`           |   声明式事务管理   |      数据库操作事务管理      |
|  **配置相关**  |           `@Configuration`           |     声明配置类     |       Spring配置类定义       |
|                |               `@Bean`                |    声明Bean定义    |       第三方库Bean注册       |
|                |      `@ConfigurationProperties`      |    批量属性绑定    |       配置前缀批量注入       |
|  **切面编程**  |              `@Aspect`               |     声明切面类     |        AOP切面实现类         |
|                |          `@Before`/`@After`          |    通知类型标记    |      前置/后置增强逻辑       |

## Filter和 Interceptor

|     **维度**     |         **Filter（过滤器）**         |   **Interceptor（拦截器）**    |
| :--------------: | :----------------------------------: | :----------------------------: |
|   **规范来源**   |       Servlet规范（J2EE标准）        |         Spring MVC框架         |
|   **作用范围**   |     所有Web请求（包括静态资源）      |  仅Spring管理的Controller请求  |
| **生命周期管理** |         Web容器（如Tomcat）          |         Spring IoC容器         |
|  **Spring依赖**  |         无法使用Spring Bean          |     可直接注入Spring Bean      |
|   **执行粒度**   |            请求/响应层面             |       Controller方法层面       |
|   **控制能力**   | 只能中断请求（`response.sendError`） | 可中断或修改Controller处理流程 |

## 事务失效的场景

![cd5de7a66d2a919e9210b222a7dce169](https://pub-8f51c562924b4b9f89b40704dbb3bc16.r2.dev/PicGo/cd5de7a66d2a919e9210b222a7dce169.png)

## Bean的初始化过程

![1699966914771-319aeb73-ee91-46f8-b32a-cba0e57bcc74.png](https://pub-8f51c562924b4b9f89b40704dbb3bc16.r2.dev/PicGo/1699966914771-319aeb73-ee91-46f8-b32a-cba0e57bcc74-169298.png)

## Autowired和Resource的不同？

### byName和byType匹配顺序不同

1. Autowired在获取bean的时候，先是byType的方式，再是byName的方式。意思就是先在Spring容器中找以Bean为类型的Bean实例，如果找不到或者找到多个bean，则会通过fieldName来找。举个例子：

```java
@Component("beanOne")
class BeanOne implements Bean {}
@Component("beanTwo")
class BeanTwo implements Bean {}
@Service
class Test {
    // 此时会报错，先byType找到两个bean：beanOne和beanTwo
    // 然后通过byName（bean）仍然没办法匹配
	@Autowired
    private Bean bean; 

    // 先byType找到两个bean，然后通过byName确认最后要注入的bean
    @Autowired
    private Bean beanOne;

    // 先byType找到两个bean，然后通过byName确认最后要注入的bean
    @Autowired
    @Qualifier("beanOne")
    private Bean bean;
}
```

2. Resource在获取bean的时候，和Autowired恰好相反，先是byName方式，然后再是byType方式。当然，我们也可以通过注解中的参数显示指定通过哪种方式。同样举个例子：

```java
@Component("beanOne")
class BeanOne implements Bean {}
@Component("beanTwo")
class BeanTwo implements Bean {}
@Service
class Test {
    // 此时会报错，先byName，发现没有找到bean
    // 然后通过byType找到了两个Bean：beanOne和beanTwo，仍然没办法匹配
	@Resource
    private Bean bean; 

    // 先byName直接找到了beanOne，然后注入
    @Resource
    private Bean beanOne;

    // 显示通过byType注入，能注入成功
    @Resource(type = BeanOne.class)
    private Bean bean;
}
```

### 作用域不同

1. Autowired可以作用在构造器，字段，setter方法上
2. Resource 只可以使用在field，setter方法上

### 支持方不同

1. Autowired是Spring提供的自动注入注解，只有Spring容器会支持，如果做容器迁移，是需要修改代码的
2. Resource是JDK官方提供的自动注入注解（JSR-250）。它等于说是一个标准或者约定，所有的IOC容器都会支持这个注解。假如系统容器从Spring迁移到其他IOC容器中，是不需要修改代码的。

### 默认要求不同


@Autowired注解默认要求要注入的Bean必须存在，如果找不到匹配的Bean会抛出异常。

@Resource注解默认允许注入的Bean可以缺失，如果找不到匹配的Bean会使用默认值null。

## Springboot是如何实现自动配置的

SpringBoot通过Spring 的条件配置决定哪些bean可以被配置，将这些条件定义成具体的Configuration，然后将这些Configuration配置到spring.factories文件中(这种方式Springboot 2.7.0版本已不建议使用，最新的方式是使用/META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports)

作为key: org.springframework.boot.autoconfigure.EnableAutoConfiguration的值

这时候，容器在启动的时候，由于使用了EnableAutoConfiguration注解，该注解Import的EnableAutoConfigurationImportSelector会去扫描classpath下的所有spring.factories文件，然后进行bean的自动化配置

## 什么是Spring的三级缓存

**singletonObjects是一级缓存，存储的是完整创建好的单例bean对象。** 在创建一个单例bean时，会先从singletonObjects中尝试获取该bean的实例，如果能够获取到，则直接返回该实例，否则继续创建该bean。



**earlySingletonObjects是二级缓存，存储的是尚未完全创建好的单例bean对象。** 在创建单例bean时，如果发现该bean存在循环依赖，则会先创建该bean的"半成品"对象，并将"半成品"对象存储到earlySingletonObjects中。当循环依赖的bean创建完成后，Spring会将完整的bean实例对象存储到singletonObjects中，并将earlySingletonObjects中存储的代理对象替换为完整的bean实例对象。这样可以保证单例bean的创建过程不会出现循环依赖问题。



**singletonFactories是三级缓存，存储的是单例bean的创建工厂。** 当一个单例bean被创建时，Spring会先将该bean的创建工厂存储到singletonFactories中，然后再执行创建工厂的getObject()方法，生成该bean的实例对象。在该bean被其他bean引用时，Spring会从singletonFactories中获取该bean的创建工厂，创建出该bean的实例对象，并将该bean的实例对象存储到singletonObjects中。

