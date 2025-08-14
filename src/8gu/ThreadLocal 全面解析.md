# Java中引用类型和[ThreadLocal](https://so.csdn.net/so/search?q=ThreadLocal&spm=1001.2101.3001.7020)

```java
大厂面试题:
1.Java中的引用类型有哪几种?
2.每种引用类型的特点是什么?
3.每种引用类型的应用场景是什么?
4.ThreadLocal你了解吗
5.ThreadLocal应用在什么地方?  Spring事务方面应用到了
6.ThreadLocal会产生内存泄漏你了解吗?
```

## 1\. java中引用类型及特点

- 强 引用: 最普通的引用 `Object o = new Object()`
- 软 引用: 垃圾回收器, 内存不够的时候回收 (缓存)
- 弱 引用: 垃圾回收器看见就会回收 (防止内存泄漏)
- 虚 引用: 垃圾回收器看见二话不说就回收,跟没有一样 (管理堆外内存) DirectByteBuffer -> 应用到NIO Netty

> **finalize()**: 当对象被回收时, finalize()方法会被调用, 但是不推荐使用去回收一些资源,因为不知道他什么时候会被调用, 有时候不一定会调用

```java
public class C {
    @Override
    protected void finalize() throws Throwable {
        System.out.println("finalize");
    }
}
```

### 1.1 强引用

正常引用，但没有人指向的时候就会被回收．

```java
import java.io.IOException;
/**
 * 强引用
 */
public class R1_NormalReference {
    public static void main(String[] args) throws IOException {
        //正常引用
        C c = new C();
        c = null;//没人指向
        System.gc();//DisableExplicitGC

        //阻塞一下,方便看结果
        System.in.read();
    }
}
```

### 1.2 软引用

垃圾回收器, 内存不够的时候回收 (缓存)

```java
import java.io.IOException;
import java.lang.ref.SoftReference;

/**
 * 软引用
 */
public class R2_SoftReference {
    public static void main(String[] args) {
        SoftReference<byte[]> soft = new SoftReference<>(new byte[1024 * 1024 * 10]);//10M
        System.out.println(soft.get());
        //gc回收
        System.gc();
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println(soft.get());

        //再分配一个数组,好heap(堆)放不下, 这个时候系统会回收一次, 如果不够,会把软引用回收
        byte[] bytes = new byte[1024 * 1024 * 15];
        System.out.println(soft.get());

    }
}

结果:
[B@1540e19d
[B@1540e19d
null
```

前提设置 -Xmx30M 堆内存最大30M 用于测试

idea里这样设置  
![给堆内存分配空间](https://i-blog.csdnimg.cn/blog_migrate/e393bb6d8f88fda2dd036908c72e6e3a.png)

### 1.3 弱引用

遇到GC就会被回收

```java
import java.lang.ref.WeakReference;
/**
 * 弱引用
 */
public class R3_WeakReference {
    public static void main(String[] args) {
        WeakReference<C> weak = new WeakReference<>(new C());
        System.out.println(weak.get());
        //gc回收
        System.gc();
        //遇到GC就会被回收
        System.out.println(weak.get());

    }
}

结果:
com.cz.reference.C@3c679bde
null
finalize
```

### 1.4 虚引用

不管三七二十一 遇到直接回收

```java
import java.lang.ref.PhantomReference;
import java.lang.ref.Reference;
import java.lang.ref.ReferenceQueue;
import java.util.LinkedList;
import java.util.List;
/**
 * 虚引用
 */
public class R4_PhantomReference {
    private static final List<Object> LIST = new LinkedList<>();
    private static final ReferenceQueue QUEUE = new ReferenceQueue();

    public static void main(String[] args) {

        PhantomReference<C> phantomReference = new PhantomReference<>(new C(),QUEUE);

        new Thread(() -> {
            while (true){
                LIST.add(new byte[1024*1024]);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                    Thread.currentThread().interrupt();
                }
                System.out.println(phantomReference.get());
            }
        }).start();

        new Thread(() -> {
            while (true){
                Reference<? extends C> poll = QUEUE.poll();
                if (poll != null){
                    System.out.println("-----虚引用对象被JVm回收了--------" + poll);
                    return;
                }
            }
        }).start();
    }
}
结果:
null
null
finalize
null
null
```

### 总结: 强软弱虚 [1](#fn1)

- 强 正常的引用
- 软 内存不够, 进行清除
  - 大对象的内存
  - 常用对象的缓存
- 弱 遇到GC就会被回收
  - 缓存, 没有容器引用指向的时候就需要清除缓存
  - ThreadLocal
  - WeakReferenceMap
- 虚 看见就回收, 且看不到值
  - 管理堆外内存

## 2\. ThreadLocal

从Java官方文档中的描述：ThreadLocal类用来提供线程内部的局部变是。这种变畺在多线程环境下访问（通 过get和set方法访问）时能保证各个线程的变星=相对独立于其他线程内的变垦。ThreadLocal实例通常来说都是 private static类型的，用于关联线程和线程上下文。

我们可以得知ThreadLocal的作用是：提供线程内的周部变星，不同的线程之间不会相互干扰，这种变星在 线程的生命周朗内起作用，减少同一个线程内多个函数或组件之间一些公共变畺传递的复杂度.

### 2.1.特点:

| 特点                                                         | 内容                                                     |
| ------------------------------------------------------------ | -------------------------------------------------------- |
| 1.`线程并发`                                                 | 在多线程并发场景下                                       |
| 2.`传递数据`                                                 | 我们可以通过ThreadLocal在同一线程,不同组件中传递公共变量 |
| (保存每个线程的数据,在需要的地方可以直接获取, 避免参数直接传递带来的代码耦合问题) |                                                          |
| 3.`线程隔离`                                                 | 每个线程的变量都是独立的, 不会互相影响.(核心)            |
| (各线程之间的数据相互隔离却又具备并发性,避免同步方式带来的性能损失) |                                                          |

### 2.2 ThreadLocal 和Synchronized的区别

虽然ThreadLocal模式与Synchronized关键字都用于处理多线程并发访问变量的问题, 不过两者处理问题的角度和思路不同

|        | synchronized                                                 | ThreadLocal                                                  |
| ------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 原理   | 同步机制采用`以时间换空间`的方式,只提供了一份变量, 让不同的线程排队访问 | ThreadLocal采用`以空间换时间`的方式, 为每一个线程都提供了一份变量的副本, 从而实现同访问而相不干扰 |
| 侧重点 | 多个线程之间访问资源的同步                                   | 多线程中让每个线程之间的数据相互隔离                         |

### 2.3 ThreadLocal的内部结构

现在让我们看一下ThreadLocal的内部原理, 探究它能实现线程数据隔离的原理

#### JDK 早期设计:

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/c82518a6dbd8264cba2208273d462f0b.png)

每个ThreadLocal都创建一个`Map`, 然后用Thread(线程) 作为Map的`key`, 要存储的局部变量作为Map的`value`, 这样就能达到各个线程的局部变量隔离的效果, 这是最简单的设计方法. 早期设计

#### JDK8 优化设计(现在的设计)

JDK8中ThreadLocal的设计是 : 每个Thread维护一个`ThreadLocalMap`, 这个Map的`key`是`ThreadLocal`实例本身,`value`才是真正要存储的值`Object`  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/1f1d024d2fbc82dcd3860b193a8ffe9b.png)

具体过程如下:


1. 每个THreadLocal线程内部都有一个Map(ThreadLocalMap)

2. Map里面存储的ThreadLocal对象(key)和线程变量副本(Value)也就是存储的值

3. Thread内部的Map是由ThreadLocal维护的, 有THreadLocal负责向map获取和设置线程变量值

4. 对于不同的线程, 每次获取value(也就是副本值),别的线程并不能获取当前线程的副本值, 形成了副本的隔离,互不干扰.


对比一下 :  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/e6f5bcfa7ea95f03160d0892af0fa98f.png)

如今设计的好处:

1.  每个Map存储的Entry数量变少
2.  当Thread销毁的时候, THreadLocalMap也会随之销毁, 减少内存的使用.(之前以Thread为key会导致ThreadLocalMap的生命周期很长)

### 2.4 THreadLocalMap源码分析

#### 2.4.1 基本结构

ThreadLocalMap是ThreadLocal的静态内部类, 没有实现Map接口, 用独立的方式实现了Map的功能, 其内部的Entry也是独立实现.

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/4870e4b3246b051732094151365d369c.png)  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/8398bf4f267d1050c2cd4ddfc2fa8edf.png)

##### 1\. 成员变量

```java
		/**
         * The initial capacity -- MUST be a power of two.
         * 初始化容量,必须是2的整数次幂
         */
        private static final int INITIAL_CAPACITY = 16;

        /**
         * 存放数据的table, 同样数组长度必须是2的整数次幂
         * The table, resized as necessary.
         * table.length MUST always be a power of two.
         */
        private Entry[] table;

        /**
         * 数组里entrys的个数,可以判断table是否超过阈值 (存储的格式)
         * The number of entries in the table.
         */
        private int size = 0;

        /**
         * 阈值 进行扩容的阈值,表使用大于他的时候,进行扩容
         * The next size value at which to resize.
         */
        private int threshold; // Default to 0
```

##### 2.存储结构-Entry

```java
		/**
         * The entries in this hash map extend WeakReference, using
         * its main ref field as the key (which is always a
         * ThreadLocal object).  Note that null keys (i.e. entry.get()
         * == null) mean that the key is no longer referenced, so the
         * entry can be expunged from table.  Such entries are referred to
         * as "stale entries" in the code that follows.
         翻译:
         * Entry继承WeakReference, 并且用ThreadLocal作为key
         * 如果key为null(entry.get() == null)意味着key不在被引用,因此这时候entry也可以从tab
         *中清除(被垃圾回收器回收)
         */
        static class Entry extends WeakReference<ThreadLocal<?>> {
            /** The value associated with this ThreadLocal. */
            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                super(k);
                value = v;
            }
        }
```

(ThreadLocal) key是弱引用, 其目的就是讲ThreadLocal对象的生命周期和和线程的生命周期解绑. 减少内存使用

### 2.5 强弱引用和内存泄漏

#### 1.内存泄漏相关概念

- 内存溢出: Memory overflow 没有足够的内存提供申请者使用.
- 内存泄漏: Memory Leak 程序中已经动态分配的堆内存由于某种原因, 程序未释放或者无法释放, 造成系统内部的浪费, 导致程序运行速度减缓甚至系统崩溃等严重结果. 内存泄漏的堆积终将导致内存溢出

#### 2.强弱引用见第一大点. (如上)

#### 3.如果key是强引用

假设ThreadLocalMap中的key使用了强引用, 那么会出现内存泄漏吗?  
![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/939e62202eb0075d68a4f172a45870c5.png)

> 1.  假设在业务代码中使用完ThreadLocal, ThreadLocal ref被回收了
> 2.  但是因为threadLocalMap的Entry强引用了threadLocal, 造成ThreadLocal无法被回收
> 3.  在没有手动删除Entry以及CurrentThread依然运行的前提下, 始终有强引用链threadRef → currentThread → entry, Entry就不会被回收( Entry中包括了ThreadLocal实例和value), 导致Entry内存泄漏
>
>     也就是说: ThreadLocalMap中的key使用了强引用, 是无法完全避免内存泄漏的

#### 4.如果key是弱引用

假设ThreadLocalMap中的key使用了弱引用, 那么会出现内存泄漏吗?

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/2939ee9a417bb5fafbc71babee13b754.png)

> 1.  假设在业务代码中使用完ThreadLocal, ThreadLocal ref被回收了
> 2.  由于threadLocalMap只持有ThreadLocal的弱引用, 没有任何强引用指向threadlocal实例, 所以threadlocal就可以顺利被gc回收, 此时Entry中的key = null
> 3.  在没有手动删除Entry以及CurrentThread依然运行的前提下, 也存在有强引用链threadRef → currentThread → value, value就不会被回收, 而这块value永远不会被访问到了, 导致value内存泄漏
>
>     也就是说: ThreadLocalMap中的key使用了弱引用, 也有可能内存泄漏。

#### 5.内存泄漏的真实原因

![在这里插入图片描述](https://i-blog.csdnimg.cn/blog_migrate/ef8dc7ed765f2f935f7cdce47f2b6691.png)  
出现内存泄漏的真实原因出改以上两种情况，[2](#fn2)  
比较以上两种情况,我们就会发现:  
内存泄漏的发生跟 `ThreadLocalIMap` 中的 `key` 是否使用弱引用是没有关系的。那么内存泄漏的的真正原因是什么呢？

细心的同学会发现，在以上两种内存泄漏的情况中．都有两个前提：  
1 ．没有手动侧除这个 Entry  
2 · CurrentThread 依然运行  
第一点很好理解，只要在使用完下 ThreadLocal ，调用其 remove 方法翻除对应的 Entry ，就能避免内存泄漏。  
第二点稍微复杂一点，由于`ThreodLocalMap` 是 `Threod` 的一个属性，被当前线程所引甲丁所以它的生命周期跟 `Thread` 一样长。那么在使用完 ThreadLocal 的使用，如果当前Thread 也随之执行结束， ThreadLocalMap 自然也会被 gc 回收，从根源上避免了内存泄漏。

综上， ThreadLocal 内存泄漏的根源是：

由于ThreadLocalMap 的生命周期跟 Thread 一样长，如果没有手动删除对应 key 就会导致内存泄漏．

#### 6 为什么使用弱引用

为什么使用弱引用，根据刚才的分析，我们知道了：

无论 ThreadLocalMap 中的 key 使用哪种类型引用**都无法完全避免内存泄漏**，跟使用弱引用没有关系。

 要避免内存泄漏有两种方式：  
 1 ．使用完 ThreadLocal ，调用其 remove 方法删除对应的 Entry  
 2 ．使用完 ThreadLocal ，当前 Thread 也随之运行结束

 相对第一种方式，第二种方式显然更不好控制，特别是使用线程池的时候，线程结束是不会销毁的．

 也就是说，只要记得在使用完ThreadLocal 及时的调用 remove ，无论 key 是强引用还是弱引用都不会有问题.

**那么为什么 key 要用弱引用呢**

 事实上，在 ThreadLocalMap 中的`set/getEntry` 方法中，会对 key 为 null （也即是 ThreadLocal 为 null ）进行判断，如果为 null 的话，那么是会又如 value 置为 null 的．

 这就意味着使用完 ThreadLocal , CurrentThread 依然运行的前提下．就算忘记调用 remove 方法，弱引用比强引用可以多一层保障：弱引用的 ThreadLocal 会被回收．对应value在下一次 ThreadLocaIMap 调用 `set/get/remove` 中的任一方法的时候会被清除，从而避免内存泄漏．
