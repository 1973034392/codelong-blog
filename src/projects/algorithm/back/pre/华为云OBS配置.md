---
title: 华为云OBS配置
---
## 华为云存储服务OBS配置

查看官方文档 <https://support.huaweicloud.com/sdk-java-devg-obs/obs_21_0001.html>

* 创建桶

  在华为云控制台创建桶

  ![Clip_2024-10-24_21-01-03](https://s2.loli.net/2024/10/24/eSlBbZDLQqiYIfF.png)

### 获取安全密钥

![Clip_2024-10-24_21-06-18](https://s2.loli.net/2024/10/24/3L7VEhuBIm2zrJq.png)



![Clip_2024-10-24_21-06-30](https://s2.loli.net/2024/10/24/W7uHkcr3QEOXysT.png)

> 然后保存密钥信息

### 在spring中集成obs服务

1. 引入依赖

   ```xml
   <dependency>
       <groupId>com.huaweicloud</groupId>
       <artifactId>esdk-obs-java-bundle</artifactId>
       <version>3.24.3</version>
   </dependency>
   ```

2. 将配置信息配置到yaml配置文件中

   ```yaml
   huaweiyun:
     obs:
       endPoint: https://obs.cn-north-4.myhuaweicloud.com
       accessKeyId: -------------------
       secretAccessKey: ------------------------------------
       bucketName: web-tlias-cn
   ```

3. 创建对应的配置文件中华为账户对应的实体类

   ```java
   @Data
   @Component
   @ConfigurationProperties(prefix = "huaweiyun.obs")
   public class HuaWeiOBSConfiguration {
   
       private String endPoint;
   
       private String accessKeyId;
   
       private String secretAccessKey;
   
       private String bucketName;
   
   }
   ```

4. 配置obs工具类

   ```java
   @Slf4j
   @RequiredArgsConstructor
   @Component
   public class OBSUtils {
   
       private final HuaWeiOBSConfiguration huaWeiOBSConfiguration;
   
       public String upload(MultipartFile file){
           //获取华为云Obs参数
           String endpoint = huaWeiOBSConfiguration.getEndPoint();
           String accessKeyId = huaWeiOBSConfiguration.getAccessKeyId();
           String accessKeySecret = huaWeiOBSConfiguration.getSecretAccessKey();
           String bucketName = huaWeiOBSConfiguration.getBucketName();
           // 获取上传的文件的输入流
           try {
               InputStream inputStream = file.getInputStream();
   
               // 避免文件覆盖
               String originalFilename = file.getOriginalFilename();
               String fileName = UUID.randomUUID() + originalFilename.substring(originalFilename.lastIndexOf("."));
   
               //上传文件到 OBS
               ObsClient obsClient = new ObsClient(accessKeyId, accessKeySecret, endpoint);
               obsClient.putObject(bucketName, fileName, inputStream);
   
               // https://1973034392.obs.cn-north-4.myhuaweicloud.com/8b1af7de-24f1-4519-9fe7-03d7c306193c.png
               String url = "https://" + bucketName + "." + endpoint + "/" + fileName;
               // 关闭obsClient
               obsClient.close();
               return url;// 把上传到oss的路径返回
           }catch (Exception e){
               throw new FileUploadException(e.getMessage());
           }
       }
   }
   ```

5. 将上传方法配置到消息队列

   ```java
   @Component
   @RequiredArgsConstructor
   public class FileUploadListener {
   
       private final OBSUtils obsUtils;
   
       @RabbitListener(bindings = @QueueBinding(
               value = @Queue(name = "file.upload.queue",durable = "true"),
               exchange = @Exchange(name = "file.direct"),
               key = "file.upload"
       ))
       public String upload(MultipartFile file){
           return obsUtils.upload(file);
       }
   
   }
   ```

