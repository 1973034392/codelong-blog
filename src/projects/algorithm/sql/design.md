---
title: 表结构的设计
---
## 数据库表设计

### 用户

* 名字 : user

* | 字段        | 数据类型     | 说明         | 备注       |
  | ----------- | ------------ | ------------ | ---------- |
  | id          | bigint       | 主键         | 自增       |
  | name        | varchar(10)  | 姓名         |            |
  | nickname    | varchar(20)  | 昵称         |            |
  | username    | varchar(32)  | 用户名       | 唯一       |
  | password    | varchar(80)  | 密码(加密后) |            |
  | email       | varchar(30)  | 邮箱         | 唯一       |
  | avatar      | varchar(100) | 头像地址     |            |
  | status      | int          | 账号状态     | 1正常0锁定 |
  | create_time | datetime     | 创建时间     |            |
  | update_time | datetime     | 最后修改时间 |            |
  

### 题目

* 名字 : problem

* |     字段     | 数据类型    | 说明                              | 备注      |
  | :----------: | ----------- | --------------------------------- | --------- |
  |      id      | bigint      | 题目ID                            | 主键 索引 |
  |    title     | varchar(30) | 题目标题                          |           |
  |    detail    | text        | 题目描述(md文档)                  |           |
  |  difficulty  | int         | 题目难度，1简单，2中等，3困难     |           |
  |    status    | int         | 题目状态(0未开放,1正常,2比赛专用) |           |
  |  time_limit  | int         | 时间限制(单位是ms)                |           |
  | memory_limit | int         | 内存限制(单位是mb)                |           |
  | stack_limit  | int         | 栈限制(单位是mb)                  |           |
  |  sub_number  | int         | 提交次数                          |           |
  |  ac_number   | int         | AC次数                            |           |
  | create_time  | datetime    | 创建时间                          |           |
  | update_time  | datetime    | 最后修改时间                      |           |

### 题单

* 名字 :  problem_list

* | 字段        | 数据类型     | 说明                    | 备注 |
  | ----------- | ------------ | ----------------------- | ---- |
  | id          | bigint       | 题单ID                  | 主键 |
  | name        | varchar(30)  | 题单名称                |      |
  | more        | varchar(100) | 题单描述                |      |
  | status      | int          | 题单状态(1正常,0不可用) |      |
  | password    | varchar(30)  | 题单密码(不写为没有)    |      |
  | create_time | datetime     | 创建时间                |      |
  | update_time | datetime     | 最后修改时间            |      |
  

### 题单题目对应

* 名字:problem_list_problem

* | 字段            | 数据类型 | 说明     | 备注 |
  | --------------- | -------- | -------- | ---- |
  | id              | bigint   | 对应表ID | 主键 |
  | problem_id      | bigint   | 题目id   | 索引 |
  | problem_list_id | bigint   | 题单ID   | 索引 |
  

### 标签

* 名字 : tag

* | 字段        | 数据类型    | 说明         | 备注 |
  | ----------- | ----------- | ------------ | ---- |
  | id          | bigint      | 标签ID       | 主键 |
  | name        | varchar(20) | 标签名       | 索引 |
  | more        | varchar(40) | 标签描述     |      |
  | color       | varchar(10) | 标签颜色     |      |
  | create_time | datetime    | 创建时间     |      |
  | update_time | datetime    | 最后修改时间 |      |
  
  

### 提交记录

* 名字 : submission

* | 字段          | 数据类型    | 说明             | 备注 |
  | ------------- | ----------- | ---------------- | ---- |
  | id            | bigint      | 提交ID           | 主键 |
  | user_id       | bigint      | 用户ID           | 索引 |
  | problem_id    | bigint      | 题目ID           | 索引 |
  | create_time   | datetime    | 创建时间         |      |
  | code_language | varchar(20) | 提交语言         |      |
  | judge_score   | int         | 分数(满分100)    |      |
  | code          | text        | 提交代码         |      |
  | judge_result  | int         | 判定结果         |      |
  | judge_time    | int         | 判定时间(单位ms) |      |
  | judge_memory  | int         | 判定内存(单位mb) |      |
  
  
### 提交记录测试点

* 名字 : sub_point

* | 字段           | 数据类型    | 说明             | 备注 |
  | -------------- | ----------- | ---------------- | ---- |
  | id             | bigint      | 提交ID           | 主键 |
  | submission_id  | bigint      | 提交记录ID       |      |
  | judge_point_id | bigint      | 提交点ID         |      |
  | code_language  | varchar(20) | 提交语言         |      |
  | input          | text        | 测试点输入       |      |
  | output         | text        | 测试点输出       |      |
  | judge_result   | int         | 判定结果         |      |
  | judge_time     | int         | 判定时间(单位ms) |      |
  | judge_memory   | int         | 判定内存(单位mb) |      |
  

### 比赛

* 名字 : contest

* | 字段        | 数据类型    | 说明                    | 备注 |
  | ----------- | ----------- | ----------------------- | ---- |
  | id          | bigint      | 比赛ID                  | 主键 |
  | name        | varchar(50) | 比赛名称                |      |
  | more        | test        | 比赛说明                |      |
  | start_time  | datetime    | 开始时间                |      |
  | end_time    | datetime    | 结束时间                |      |
  | type        | int         | 是否需要密码(1表示需要) |      |
  | password    | varchar(20) | 比赛密码(没有为空)      |      |
  | create_time | datetime    | 创建时间                |      |
  | update_time | datetime    | 结束时间                |      |


### 比赛参赛用户

* 名字 : contest_user

* | 字段        | 数据类型 | 说明                    | 备注      |
  | ----------- | -------- | ----------------------- | --------- |
  | id          | bigint   | 主键                    | 主键,自增 |
  | user_id     | bigint   | 用户id                  |           |
  | contest_id  | bigint   | 比赛id                  |           |
  | status      | int      | 报名者状态(1正常,0失效) |           |
  | create_time | datetime | 创建时间                |           |
  | update_time | datetime | 最后修改时间            |           |

### 比赛题目对应

* 名字 : contest_problem

* | 字段       | 数据类型 | 说明       | 备注      |
  | ---------- | -------- | ---------- | --------- |
  | id         | bigint   | 主键       | 主键,自增 |
  | contest_id | bigint   | 比赛id     |           |
  | problem_id | bigint   | 对应题目id |           |


### 题目标签对应 

* 名字 : problem_tag

* | 字段        | 数据类型 | 说明     | 备注      |
  | ----------- | -------- | -------- | --------- |
  | id          | bigint   | 主键     | 自增,主键 |
  | problem_id  | bigint   | 题目ID   |           |
  | tag_id      | bigint   | 标签ID   |           |
  | create_time | datetime | 创建时间 |           |
  

### 测试点

* 名字  : judge_point

* | 字段       | 数据类型     | 说明     | 备注 |
  | ---------- | ------------ | -------- | ---- |
  | id         | bigint       | 测试点ID | 主键 |
  | problem_id | bigint       | 题目ID   |      |
  | input      | varchar(500) | 输入内容 |      |
  | output     | varchar(500) | 输出内容 |      |
  

### 比赛提交

* 名字 : contest

* | 字段          | 数据类型    | 说明             | 备注 |
  | ------------- | ----------- | ---------------- | ---- |
  | id            | bigint      | 提交ID           | 主键 |
  | user_id       | bigint      | 用户ID           | 索引 |
  | problem_id    | bigint      | 题目ID           | 索引 |
  | code_language | varchar(20) | 提交语言         |      |
  | code          | text        | 提交代码         |      |
  | judge_result  | int         | 判定结果         |      |
  | judge_time    | int         | 判定时间(单位ms) |      |
  | contest_id    | bigint      | 比赛id           |      |
  
### 判题judge

* 名字 judge

* | 字段          | 数据类型     | 说明     | 备注     |
  | ------------- | ------------ | -------- | -------- |
  | id            | bigint       | 主键     | 主键自增 |
  | problem_id    | bigint       | 题目id   |          |
  | user_id       | bigint       | 用户id   |          |
  | submit_time   | datetime     | 提交时间 |          |
  | status        | int          | 判题结果 |          |
  | error_message | varchar(100) | 错误提示 |          |
  | time          | datetime     | 运行时间 |          |
  | memory        | int          | 运行内存 |          |
  | length        | int          | 代码长度 |          |
  | code          | text         | 代码     |          |
  | language      | varchar(20)  | 使用语言 |          |
  | judger        | varchar(30)  | 判题机ip |          |
  | create_time   | datetime     | 创建时间 |          |
  | update_time   | datetime     | 更新时间 |          |
  

### 系统公告

* 名字 : announcement

* | 字段        | 数据类型     | 说明     | 备注      |
  | ----------- | ------------ | -------- | --------- |
  | id          | bigint       | 主键     | 主键,自增 |
  | title       | varchar(40)  | 公告标题 |           |
  | text        | varchar(200) | 公告内容 |           |
  | create_time | datetime     | 发布时间 |           |

* ```sql
  CREATE TABLE announcement (
                                id BIGINT AUTO_INCREMENT,
                                title VARCHAR(40) NOT NULL,
                                text VARCHAR(200),
                                create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
                                PRIMARY KEY (id)
  );
  INSERT INTO algorithm.announcement (id, title, text, create_time) VALUES (1, '小葵花妈妈课堂开课了', '快来上课啦', '2024-10-20 22:37:38');
  INSERT INTO algorithm.announcement (id, title, text, create_time) VALUES (2, '孩子咳嗽老不好', '那该怎么办呢', '2024-10-21 15:34:51');
  INSERT INTO algorithm.announcement (id, title, text, create_time) VALUES (3, '多半是废了', '真棒', '2024-10-22 22:38:27');
  ```

* 

## 建表语句

```sql
-- 用户表
CREATE TABLE `user` (
                        `id` bigint(20) NOT NULL AUTO_INCREMENT,
                        `name` varchar(10) DEFAULT NULL,
                        `nickname` varchar(20) DEFAULT NULL,
                        `username` varchar(32) NOT NULL,
                        `password` varchar(80) NOT NULL,
                        `email` varchar(30) NOT NULL,
                        `avatar` varchar(100) DEFAULT NULL,
                        `status` int(11) NOT NULL,
                        `create_time` datetime NOT NULL,
                        `update_time` datetime NOT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `username` (`username`),
                        UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 管理员表
CREATE TABLE `admin` (
                         `id` bigint(20) NOT NULL AUTO_INCREMENT,
                         `username` varchar(32) NOT NULL,
                         `password` varchar(50) NOT NULL,
                         PRIMARY KEY (`id`),
                         UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 题目表
CREATE TABLE `problem` (
                           `id` bigint(20) NOT NULL AUTO_INCREMENT,
                           `title` varchar(30) NOT NULL,
                           `describe` text,
                           `input` varchar(500) DEFAULT NULL,
                           `output` varchar(500) DEFAULT NULL,
                           `difficulty` int(11) NOT NULL,
                           `status` int(11) NOT NULL,
                           `time_limit` int(11) NOT NULL,
                           `memory_limit` int(11) NOT NULL,
                           `stack_limit` int(11) NOT NULL,
                           `sub_number` int(11) NOT NULL,
                           `ac_number` int(11) NOT NULL,
                           `hard_level` int(11) NOT NULL,
                           `create_time` datetime NOT NULL,
                           `update_time` datetime NOT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 个人做题记录表
CREATE TABLE `user_problem_record` (
                                       `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                       `user_id` bigint(20) NOT NULL,
                                       `ac_problem` text,
                                       `other_problem` text,
                                       `update_time` datetime NOT NULL,
                                       PRIMARY KEY (`id`),
                                       UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 文章表
CREATE TABLE `article` (
                           `id` bigint(20) NOT NULL AUTO_INCREMENT,
                           `user_id` bigint(20) NOT NULL,
                           `title` varchar(25) NOT NULL,
                           `create_time` datetime NOT NULL,
                           `update_time` datetime NOT NULL,
                           `context` text,
                           `view` int(11) NOT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 文章点赞表
CREATE TABLE `article_like` (
                                `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                `user_id` bigint(20) NOT NULL,
                                `article_id` bigint(20) NOT NULL,
                                `like_time` datetime NOT NULL,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 评论表
CREATE TABLE `comment` (
                           `id` bigint(20) NOT NULL AUTO_INCREMENT,
                           `user_id` bigint(20) NOT NULL,
                           `article_id` bigint(20) NOT NULL,
                           `context` varchar(100) NOT NULL,
                           `create_time` datetime NOT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 题单表
CREATE TABLE `problem_list` (
                                `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                `name` varchar(30) NOT NULL,
                                `more` varchar(100) DEFAULT NULL,
                                `status` int(11) NOT NULL,
                                `password` varchar(30) DEFAULT NULL,
                                `create_time` datetime NOT NULL,
                                `update_time` datetime NOT NULL,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 题单题目对应表
CREATE TABLE `problem_list_problem` (
                                        `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                        `problem_id` bigint(20) NOT NULL,
                                        `problem_list_id` bigint(20) NOT NULL,
                                        PRIMARY KEY (`id`),
                                        INDEX `problem_id` (`problem_id`),
                                        INDEX `problem_list_id` (`problem_list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 标签表
CREATE TABLE `tag` (
                       `id` bigint(20) NOT NULL AUTO_INCREMENT,
                       `name` varchar(20) NOT NULL,
                       `more` varchar(40) DEFAULT NULL,
                       `color` varchar(10) DEFAULT NULL,
                       `create_time` datetime NOT NULL,
                       `update_time` datetime NOT NULL,
                       PRIMARY KEY (`id`),
                       UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 提交记录表
CREATE TABLE `submission` (
                              `id` bigint(20) NOT NULL AUTO_INCREMENT,
                              `user_id` bigint(20) NOT NULL,
                              `problem_id` bigint(20) NOT NULL,
                              `code_language` varchar(20) NOT NULL,
                              `judge_score` int(11) NOT NULL,
                              `code` text NOT NULL,
                              `judge_result` int(11) NOT NULL,
                              `judge_time` int(11) NOT NULL,
                              PRIMARY KEY (`id`),
                              INDEX `user_id` (`user_id`),
                              INDEX `problem_id` (`problem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 比赛表
CREATE TABLE `contest` (
                           `id` bigint(20) NOT NULL AUTO_INCREMENT,
                           `name` varchar(50) NOT NULL,
                           `describe` varchar(200) DEFAULT NULL,
                           `problem_id` varchar(500) NOT NULL,
                           `start_time` datetime NOT NULL,
                           `end_time` datetime NOT NULL,
                           `status` int(11) NOT NULL,
                           `type` int(11) NOT NULL,
                           `password` varchar(20) DEFAULT NULL,
                           `create_time` datetime NOT NULL,
                           `update_time` datetime NOT NULL,
                           PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 比赛参赛用户表
CREATE TABLE `contest_user` (
                                `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                `user_id` bigint(20) NOT NULL,
                                `contest_id` bigint(20) NOT NULL,
                                `ac_number` int(11) NOT NULL,
                                `score` int(11) NOT NULL,
                                `status` int(11) NOT NULL,
                                `create_time` datetime NOT NULL,
                                `update_time` datetime NOT NULL,
                                PRIMARY KEY (`id`),
                                INDEX `user_id` (`user_id`),
                                INDEX `contest_id` (`contest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 题目标签对应表
CREATE TABLE `problem_tag` (
                               `id` bigint(20) NOT NULL AUTO_INCREMENT,
                               `problem_id` bigint(20) NOT NULL,
                               `tag_id` bigint(20) NOT NULL,
                               `create_time` datetime NOT NULL,
                               PRIMARY KEY (`id`),
                               INDEX `problem_id` (`problem_id`),
                               INDEX `tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 测试点表
CREATE TABLE `message` (
                           `id` bigint(20) NOT NULL AUTO_INCREMENT,
                           `problem_id` bigint(20) NOT NULL,
                           `input` varchar(500) NOT NULL,
                           `output` varchar(500) NOT NULL,
                           PRIMARY KEY (`id`),
                           INDEX `problem_id` (`problem_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 比赛提交表
CREATE TABLE `contest_submission` (
                                      `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                      `user_id` bigint(20) NOT NULL,
                                      `problem_id` bigint(20) NOT NULL,
                                      `code_language` varchar(20) NOT NULL,
                                      `code` text NOT NULL,
                                      `judge_result` int(11) NOT NULL,
                                      `judge_time` int(11) NOT NULL,
                                      `contest_id` bigint(20) NOT NULL,
                                      PRIMARY KEY (`id`),
                                      INDEX `user_id` (`user_id`),
                                      INDEX `problem_id` (`problem_id`),
                                      INDEX `contest_id` (`contest_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 判题表
CREATE TABLE `judge` (
                         `id` bigint(20) NOT NULL AUTO_INCREMENT,
                         `problem_id` bigint(20) NOT NULL,
                         `user_id` bigint(20) NOT NULL,
                         `submit_time` datetime NOT NULL,
                         `status` int(11) NOT NULL,
                         `error_message` varchar(100) DEFAULT NULL,
                         `time` int(11) NOT NULL, -- 运行时间（毫秒）
                         `memory` int(11) NOT NULL, -- 运行内存（KB）
                         `length` int(11) NOT NULL, -- 代码长度（字节）
                         `code` text NOT NULL,
                         `language` varchar(20) NOT NULL,
                         `judger` varchar(30) NOT NULL,
                         `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                         PRIMARY KEY (`id`),
                         INDEX idx_judge_problem_id (`problem_id`),
                         INDEX idx_judge_user_id (`user_id`),
                         INDEX idx_judge_submit_time (`submit_time`),
                         INDEX idx_judge_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 判题机表
CREATE TABLE `judge_server` (
                                `id` bigint(20) NOT NULL AUTO_INCREMENT,
                                `name` varchar(30) NOT NULL,
                                `ip` varchar(30) NOT NULL,
                                `username` varchar(30) NOT NULL,
                                `password` varchar(30) NOT NULL,
                                `port` int(11) NOT NULL,
                                `url` varchar(40) NOT NULL,
                                `cpu_core` int(11) NOT NULL,
                                `status` int(11) NOT NULL,
                                `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                                PRIMARY KEY (`id`),
                                UNIQUE KEY `ip` (`ip`),
                                INDEX idx_judge_server_name (`name`),
                                INDEX idx_judge_server_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## 索引的创建

```sql
-- 用户表
-- 已有唯一索引
-- 无需额外索引

-- 管理员表
-- 已有唯一索引
-- 无需额外索引

-- 题目表
-- 假设经常通过 `title` 和 `hard_level` 查询题目
CREATE INDEX idx_problem_title ON `problem` (`title`);
CREATE INDEX idx_problem_hard_level ON `problem` (`hard_level`);

-- 个人做题记录表
-- 已有唯一索引
-- 无需额外索引

-- 文章表
-- 假设经常通过 `user_id` 和 `title` 查询文章
CREATE INDEX idx_article_user_id ON `article` (`user_id`);
CREATE INDEX idx_article_title ON `article` (`title`);

-- 文章点赞表
-- 假设经常通过 `user_id` 和 `article_id` 查询点赞信息
CREATE INDEX idx_article_like_user_id ON `article_like` (`user_id`);
CREATE INDEX idx_article_like_article_id ON `article_like` (`article_id`);

-- 评论表
-- 假设经常通过 `user_id` 和 `article_id` 查询评论
CREATE INDEX idx_comment_user_id ON `comment` (`user_id`);
CREATE INDEX idx_comment_article_id ON `comment` (`article_id`);

-- 题单表
-- 假设经常通过 `name` 查询题单
CREATE INDEX idx_problem_list_name ON `problem_list` (`name`);

-- 题单题目对应表
-- 假设经常通过 `problem_id` 和 `problem_list_id` 查询题单题目关系
CREATE INDEX idx_problem_list_problem_problem_id ON `problem_list_problem` (`problem_id`);
CREATE INDEX idx_problem_list_problem_problem_list_id ON `problem_list_problem` (`problem_list_id`);

-- 标签表
-- 已有唯一索引
-- 无需额外索引

-- 提交记录表
-- 假设经常通过 `user_id` 和 `problem_id` 查询提交记录
CREATE INDEX idx_submission_user_id ON `submission` (`user_id`);
CREATE INDEX idx_submission_problem_id ON `submission` (`problem_id`);

-- 比赛表
-- 假设经常通过 `name` 和 `status` 查询比赛
CREATE INDEX idx_contest_name ON `contest` (`name`);
CREATE INDEX idx_contest_status ON `contest` (`status`);

-- 比赛参赛用户表
-- 假设经常通过 `user_id` 和 `contest_id` 查询比赛参赛用户
CREATE INDEX idx_contest_user_user_id ON `contest_user` (`user_id`);
CREATE INDEX idx_contest_user_contest_id ON `contest_user` (`contest_id`);

-- 题目标签对应表
-- 假设经常通过 `problem_id` 和 `tag_id` 查询题目标签关系
CREATE INDEX idx_problem_tag_problem_id ON `problem_tag` (`problem_id`);
CREATE INDEX idx_problem_tag_tag_id ON `problem_tag` (`tag_id`);

-- 测试点表
-- 假设经常通过 `problem_id` 查询测试点
CREATE INDEX idx_message_problem_id ON `message` (`problem_id`);

-- 比赛提交表
-- 假设经常通过 `user_id`, `problem_id`, 和 `contest_id` 查询比赛提交
CREATE INDEX idx_contest_submission_user_id ON `contest_submission` (`user_id`);
CREATE INDEX idx_contest_submission_problem_id ON `contest_submission` (`problem_id`);
CREATE INDEX idx_contest_submission_contest_id ON `contest_submission` (`contest_id`);
```

> * **用户表**和**管理员表**：已经设置了唯一索引，不需要额外的索引。
> * **题目表**：添加了按`title`和`hard_level`的索引。
> * **个人做题记录表**：已经设置了唯一索引，不需要额外的索引。
> * **文章表**：添加了按`user_id`和`title`的索引。
> * **文章点赞表**：添加了按`user_id`和`article_id`的索引。
> * **评论表**：添加了按`user_id`和`article_id`的索引。
> * **题单表**：添加了按`name`的索引。
> * **题单题目对应表**：添加了按`problem_id`和`problem_list_id`的索引。
> * **标签表**：已经设置了唯一索引，不需要额外的索引。
> * **提交记录表**：添加了按`user_id`和`problem_id`的索引。
> * **比赛表**：添加了按`name`和`status`的索引。
> * **比赛参赛用户表**：添加了按`user_id`和`contest_id`的索引。
> * **题目标签对应表**：添加了按`problem_id`和`tag_id`的索引。
> * **测试点表**：添加了按`problem_id`的索引。
> * **比赛提交表**：添加了按`user_id`、`problem_id`和`contest_id`的索引。

## 测试数据插入

```sql
-- 用户表
INSERT INTO `user` (`name`, `nickname`, `username`, `password`, `email`, `avatar`, `status`, `create_time`, `update_time`)
VALUES 
('John Doe', 'johnny', 'johndoe', 'hashed_password_1', 'john@example.com', 'avatar_url_1', 1, NOW(), NOW()),
('Jane Smith', 'jane', 'janesmith', 'hashed_password_2', 'jane@example.com', 'avatar_url_2', 1, NOW(), NOW());

-- 管理员表
INSERT INTO `admin` (`username`, `password`)
VALUES 
('admin1', 'hashed_admin_password_1'),
('admin2', 'hashed_admin_password_2');

-- 题目表
INSERT INTO `problem` (`title`, `describe`, `input`, `output`, `difficulty`, `status`, `time_limit`, `memory_limit`, `stack_limit`, `sub_number`, `ac_number`, `hard_level`, `create_time`, `update_time`)
VALUES 
('Problem 1', 'Description of Problem 1', 'Input for Problem 1', 'Output for Problem 1', 0, 1, 1000, 64, 32, 0, 0, 1, NOW(), NOW()),
('Problem 2', 'Description of Problem 2', 'Input for Problem 2', 'Output for Problem 2', 1, 1, 2000, 128, 64, 0, 0, 2, NOW(), NOW());

-- 个人做题记录表
INSERT INTO `user_problem_record` (`user_id`, `ac_problem`, `other_problem`, `update_time`)
VALUES 
(1, '1', '2', NOW()),
(2, '2', '1', NOW());

-- 文章表
INSERT INTO `article` (`user_id`, `title`, `create_time`, `update_time`, `context`, `view`)
VALUES 
(1, 'Article 1 by John', NOW(), NOW(), 'Content of Article 1', 0),
(2, 'Article 2 by Jane', NOW(), NOW(), 'Content of Article 2', 0);

-- 文章点赞表
INSERT INTO `article_like` (`user_id`, `article_id`, `like_time`)
VALUES 
(2, 1, NOW()),
(1, 2, NOW());

-- 评论表
INSERT INTO `comment` (`user_id`, `article_id`, `context`, `create_time`)
VALUES 
(1, 1, 'Nice article!', NOW()),
(2, 2, 'Great work!', NOW());

-- 题单表
INSERT INTO `problem_list` (`name`, `more`, `status`, `password`, `create_time`, `update_time`)
VALUES 
('List 1', 'More details for List 1', 1, NULL, NOW(), NOW()),
('List 2', 'More details for List 2', 1, 'list2pass', NOW(), NOW());

-- 题单题目对应表
INSERT INTO `problem_list_problem` (`problem_id`, `problem_list_id`)
VALUES 
(1, 1),
(2, 1),
(1, 2);

-- 标签表
INSERT INTO `tag` (`name`, `more`, `color`, `create_time`, `update_time`)
VALUES 
('Tag 1', 'Details for Tag 1', '#FF0000', NOW(), NOW()),
('Tag 2', 'Details for Tag 2', '#00FF00', NOW(), NOW());

-- 提交记录表
INSERT INTO `submission` (`user_id`, `problem_id`, `code_language`, `judge_score`, `code`, `judge_result`, `judge_time`)
VALUES 
(1, 1, 'Python', 100, 'print("Hello, World!")', 0, 123),
(2, 2, 'C++', 85, 'std::cout << "Hello, World!";', 0, 456);

-- 比赛表
INSERT INTO `contest` (`name`, `describe`, `problem_id`, `start_time`, `end_time`, `status`, `type`, `password`, `create_time`, `update_time`)
VALUES 
('Contest 1', 'Description of Contest 1', '1,2', NOW() + INTERVAL 1 HOUR, NOW() + INTERVAL 2 HOURS, 1, 0, NULL, NOW(), NOW()),
('Contest 2', 'Description of Contest 2', '1,2', NOW() + INTERVAL 3 HOURS, NOW() + INTERVAL 4 HOURS, 1, 1, 'contest2pass', NOW(), NOW());

-- 比赛参赛用户表
INSERT INTO `contest_user` (`user_id`, `contest_id`, `ac_number`, `score`, `status`, `create_time`, `update_time`)
VALUES 
(1, 1, 0, 0, 1, NOW(), NOW()),
(2, 1, 0, 0, 1, NOW(), NOW());

-- 题目标签对应表
INSERT INTO `problem_tag` (`problem_id`, `tag_id`, `create_time`)
VALUES 
(1, 1, NOW()),
(2, 2, NOW());

-- 测试点表
INSERT INTO `message` (`problem_id`, `input`, `output`)
VALUES 
(1, 'Test input for problem 1', 'Expected output for problem 1'),
(2, 'Test input for problem 2', 'Expected output for problem 2');

-- 比赛提交表
INSERT INTO `contest_submission` (`user_id`, `problem_id`, `code_language`, `code`, `judge_result`, `judge_time`, `contest_id`)
VALUES 
(1, 1, 'Python', 'print("Hello, World!")', 0, 123, 1),
(2, 2, 'C++', 'std::cout << "Hello, World!";', 0, 456, 1);
```



 

