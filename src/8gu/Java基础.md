# Java基础

## 反射相关

反射机制指的是程序在**运行时**能够获取自身的信息。



反射操作的**目标对象**（实例）是从**堆（Heap）**中获得的，而类的**元数据**（如方法、字段、构造方法等结构信息）是从**方法区（Method Area）或元空间（Metaspace）** 中获得的。



**为什么反射慢?**

* 由于反射涉及动态解析的类型，**因此不能执行某些Java虚拟机优化**，如JIT优化。
* 在使用反射时，参数需要包装（**boxing**)成Object[] 类型，但是真正方法执行的时候，又需要再拆包（**unboxing**)成真正的类型，这些动作不仅消耗时间，而且过程中也会产生很多对象，对象一多就容易导致GC，GC也会导致应用变慢。
* 反射调用方法时会从方法数组中遍历查找，并且会检查可见性。这些动作都是耗时的。

## a=a+b 与 a+=b 的区别

+= 隐式的将加操作的结果类型强制转换为持有结果的类型。如果两个整型相加，如 byte、short 或者 int，首先会将它们提升到 int 类型，然后在执行加法操作。

```java
byte a = 127;
byte b = 127;
b = a + b; // error : cannot convert from int to byte
b += a; // ok
// (因为 a+b 操作会将 a、b 提升为 int 类型，所以将 int 类型赋值给 byte 就会编译出错)
```

## finalize是什么

Java 技术允许使用 finalize() 方法在垃圾收集器将对象从内存中清除出去之前做必要的清理工作。这个方法是由垃圾收集器在确定这个对象没有被引用时对这个对象调用的，但是什么时候调用 finalize 没有保证。

## 为什么不能用BigDecimal的equals方法做等值比较？


因为BigDecimal的equals方法和compareTo并不一样，equals方法会比较两部分内容，分别是值（value）和标度（scale），而对于0.1和0.10这两个数字，他们的值虽然一样，但是精度是不一样的，所以在使用equals比较的时候会返回false。

##  String、StringBuilder和StringBuffer

**Java中的+对字符串的拼接，其实现原理是使用StringBuilder.append。**

StringBuilder**线程不安全** StringBuffer**线程安全**

## JDK动态代理和Cglib动态代理的区别

JDK 动态代理是基于接口的，所以要求代理类一定是有定义接口的。

 CGLIB 基于 ASM 字节码生成工具，它是通过继承的方式生成目标类的子类来实现代理类，所以 要注意 final 方法。

>  它们之间的性能随着 JDK 版本的不同而不同
>
>  * jdk6 下，在运行次数较少的情况下，jdk动态代理与 cglib 差距不明显，甚至更快一 些；而当调用次数增加之后， cglib 表现稍微更快一些
>  * jdk7 下，情况发生了逆转！在运行次数较少（1,000,000）的情况下，jdk动态代理比 cglib 快了差不多30%；而当调用次数增加之后(50,000,000)， 动态代理比 cglib 快了 接近1倍 
>  * jdk8 表现和 jdk7 基本一致

## finally中代码一定会执行吗？

如果没有符合这两个条件的话，finally中的代码就无法被执行，如发生以下情况，都会导致finally不会执行：



1、System.exit()方法被执行

2、Runtime.getRuntime().halt()方法被执行

3、try或者catch中有死循环

4、操作系统强制杀掉了JVM进程，如执行了kill -9

5、其他原因导致的虚拟机崩溃了

6、虚拟机所运行的环境挂了，如计算机电源断了

7、如果一个finally是由守护线程执行的，那么是不保证一定能执行的，如果这时候JVM要退出，JVM会检查其他非守护线程，如果都执行完了，那么就直接退出了。这时候finally可能就没办法执行完。

## 什么是AIO、BIO和NIO？

BIO （Blocking I/O）：**同步阻塞I/O**，是JDK1.4之前的传统IO模型。 线程发起IO请求后，一直阻塞，直到缓冲区数据就绪后，再进入下一步操作。

NIO （<font style="color:rgb(37, 41, 51);">Non-Blocking</font> I/O）：**同步非阻塞IO**，线程发起IO请求后，不需要阻塞，立即返回。用户线程不原地等待IO缓冲区，可以先做一些其他操作，只需要定时轮询检查IO缓冲区数据是否就绪即可。

AIO （ Asynchronous I/O）：**异步非阻塞I/O模型**。线程发起IO请求后，不需要阻塞，立即返回，也不需要定时轮询检查结果，异步IO操作之后会回调通知调用方。



![1705133708567-49955e01-446a-4fef-b441-4356180eac5c.png](https://pub-8f51c562924b4b9f89b40704dbb3bc16.r2.dev/PicGo/1705133708567-49955e01-446a-4fef-b441-4356180eac5c-289154.png)



## CopyonWriteArraylist是如何实现线程安全的

CopyOnWriteArrayList底层也是通过一个数组保存数据，使用volatile关键字修饰数组，保证当前线程对数组对象重新赋值后，其他线程可以及时感知到。

在写入操作时，加了一把互斥锁ReentrantLock以保证线程安全。

看到源码可以知道写入新元素时，首先会先将原来的数组拷贝一份并且让原来数组的长度+1后就得到了一个新数组，新数组里的元素和旧数组的元素一样并且长度比旧数组多一个长度，然后将新加入的元素放置都在新数组最后一个位置后，用新数组的地址替换掉老数组的地址就能得到最新的数据了。

在我们执行替换地址操作之前，读取的是老数组的数据，数据是有效数据；执行替换地址操作之后，读取的是新数组的数据，同样也是有效数据，而且使用该方式能比读写都加锁要更加的效率。

现在我们来看读操作，读是没有加锁的，所以读是一直都能读

## HashMap的大小为什么是2的n次方？

在 JDK1.7 中，HashMap 整个扩容过程就是分别取出数组元素，一般该元素是最后一个放入链表中的元素，然后遍历以该元素为头的单向链表元素，依据每个被遍历元素的 hash 值计算其在新数组中的下标，然后进行交换。这样的扩容方式会将原来哈希冲突的单向链表尾部变成扩容后单向链表的头部。

而在 JDK 1.8 中，HashMap 对扩容操作做了优化。由于扩容数组的长度是 2 倍关系，所以对于假设初始 tableSize = 4 要扩容到 8 来说就是 0100 到 1000 的变化（左移一位就是 2 倍），在扩容中只用判断原来的 hash 值和左移动的一位（newtable 的值）按位与操作是 0 或 1 就行，0 的话索引不变，1 的话索引变成原索引加上扩容前数组。

之所以能通过这种“与运算“来重新分配索引，是因为 hash 值本来就是随机的，而 hash 按位与上 newTable 得到的 0（扩容前的索引位置）和 1（扩容前索引位置加上扩容前数组长度的数值索引处）就是随机的，所以扩容的过程就能把之前哈希冲突的元素再随机分布到不同的索引中去。

## ConcurrentHashMap怎么实现的？

> JDK 1.7 ConcurrentHashMap

在 JDK 1.7 中它使用的是数组加链表的形式实现的，而数组又分为：大数组 Segment 和小数组 HashEntry。 Segment 是一种可重入锁（ReentrantLock），在 ConcurrentHashMap 里扮演锁的角色；HashEntry 则用于存储键值对数据。一个 ConcurrentHashMap 里包含一个 Segment 数组，一个 Segment 里包含一个 HashEntry 数组，每个 HashEntry 是一个链表结构的元素。

![img](https://cdn.xiaolincoding.com//picgo/1721807523151-41ad316a-6264-48e8-9704-5b362bc0083c.webp)

JDK 1.7 ConcurrentHashMap 分段锁技术将数据分成一段一段的存储，然后给每一段数据配一把锁，当一个线程占用锁访问其中一个段数据的时候，其他段的数据也能被其他线程访问，能够实现真正的并发访问。

> JDK 1.8 ConcurrentHashMap

在 JDK 1.7 中，ConcurrentHashMap 虽然是线程安全的，但因为它的底层实现是数组 + 链表的形式，所以在数据比较多的情况下访问是很慢的，因为要遍历整个链表，而 JDK 1.8 则使用了数组 + 链表/红黑树的方式优化了 ConcurrentHashMap 的实现，具体实现结构如下：

![img](https://cdn.xiaolincoding.com//picgo/1721807523128-7b1419e7-e6ba-47e6-aba0-8b29423a8ce7.webp)

JDK 1.8 ConcurrentHashMap JDK 1.8 ConcurrentHashMap 主要通过 volatile + CAS 或者 synchronized 来实现的线程安全的。添加元素时首先会判断容器是否为空：

- 如果为空则使用 volatile 加 CAS 来初始化
- 如果容器不为空，则根据存储的元素计算该位置是否为空。
  - 如果根据存储的元素计算结果为空，则利用 CAS 设置该节点；
  - 如果根据存储的元素计算结果不为空，则使用 synchronized ，然后，遍历桶中的数据，并替换或新增节点到桶中，最后再判断是否需要转为红黑树，这样就能保证并发访问时的线程安全了。

如果把上面的执行用一句话归纳的话，就相当于是ConcurrentHashMap通过对头结点加锁来保证线程安全的，锁的粒度相比 Segment 来说更小了，发生冲突和加锁的频率降低了，并发操作的性能就提高了。

而且 JDK 1.8 使用的是红黑树优化了之前的固定链表，那么当数据量比较大的时候，查询性能也得到了很大的提升，从之前的 O(n) 优化到了 O(logn) 的时间复杂度。



## Linux常用的命令有哪些

以下是一份**Linux常用命令速查表**，涵盖文件操作、系统管理、网络工具等核心场景：

------

### 📂文件与目录操作

|    **命令**     |       **作用**        |            **常用示例**             |
| :-------------: | :-------------------: | :---------------------------------: |
|      `ls`       |     列出目录内容      |   `ls -alh`（详细列表含隐藏文件）   |
|      `cd`       |       切换目录        |        `cd ~`（返回家目录）         |
|      `pwd`      |     显示当前路径      |                `pwd`                |
|     `mkdir`     |       创建目录        |  `mkdir -p dir1/dir2`（递归创建）   |
|     `rmdir`     |      删除空目录       |          `rmdir empty_dir`          |
|      `cp`       |       复制文件        | `cp -r dir1/ dir2/`（递归复制目录） |
|      `mv`       |    移动/重命名文件    |        `mv old.txt new.txt`         |
|      `rm`       |       删除文件        |   `rm -rf dir/`（⚠️强制递归删除）    |
|     `touch`     | 创建空文件/更新时间戳 |          `touch file.txt`           |
|      `cat`      |     显示文件内容      |           `cat file.txt`            |
| `less` / `more` |     分页查看文件      |    `less -N log.log`（显示行号）    |
| `head` / `tail` |   查看文件头部/尾部   |  `tail -f app.log`（实时追踪日志）  |
|     `find`      |       搜索文件        |     `find /home -name "*.conf"`     |
|     `grep`      |       文本搜索        |     `grep -r "error" /var/log/`     |
|     `chmod`     |       修改权限        |        `chmod 755 script.sh`        |
|     `chown`     |      修改所有者       |     `chown user:group file.txt`     |

------

### 💻系统与进程管理

|    **命令**    |     **作用**     |           **常用示例**            |
| :------------: | :--------------: | :-------------------------------: |
|      `ps`      |     查看进程     |       `ps -ef | grep nginx`       |
| `top` / `htop` | 动态监控进程资源 |   `top -u mysql`（按用户过滤）    |
|     `kill`     |     终止进程     |    `kill -9 12345`（强制终止）    |
|  `systemctl`   |   系统服务管理   |    `systemctl restart apache2`    |
|      `df`      |   磁盘空间统计   | `df -hT`（人类可读+文件系统类型） |
|      `du`      |   目录空间占用   |    `du -sh /var/`（汇总大小）     |
|     `free`     |   内存使用情况   |       `free -m`（以MB显示）       |
|    `uname`     |     系统信息     |     `uname -a`（内核版本等）      |
|    `uptime`    |   系统运行时间   |       `uptime`（负载情况）        |

------

### 🌐网络工具

|     **命令**      |      **作用**      |          **常用示例**          |
| :---------------: | :----------------: | :----------------------------: |
|      `ping`       |   测试网络连通性   |     `ping -c 4 google.com`     |
| `ifconfig` / `ip` |    网络接口配置    |  `ip addr show`（查看IP地址）  |
|     `netstat`     |    网络连接状态    |  `netstat -tulpn`（监听端口）  |
|       `ss`        | 更高效的socket统计 |    `ss -ltn`（监听TCP端口）    |
|      `curl`       |    网络数据传输    | `curl -I https://example.com`  |
|      `wget`       |      下载文件      |   `wget -c http://file.zip`    |
|       `ssh`       |      远程登录      |    `ssh user@192.168.1.100`    |
|       `scp`       |    安全传输文件    | `scp file.txt user@host:/tmp/` |
|   `traceroute`    |      路由追踪      |    `traceroute example.com`    |

------

### 📦压缩与解压

|     **命令**      |   **作用**    |                         **常用示例**                         |
| :---------------: | :-----------: | :----------------------------------------------------------: |
|       `tar`       |   打包/解包   | `tar -czvf backup.tar.gz dir/`（压缩） `tar -xzvf backup.tar.gz`（解压） |
| `gzip` / `gunzip` | .gz压缩/解压  |                `gzip file.txt` → file.txt.gz                 |
|  `zip` / `unzip`  | .zip压缩/解压 |                `unzip archive.zip -d target/`                |
