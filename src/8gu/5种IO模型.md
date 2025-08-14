# Java的五种IO模型

#### 什么是阻塞？什么是同步？

- **阻塞IO 和 非阻塞IO**

这两个概念是**程序级别**的。主要描述的是程序请求操作系统IO操作后，如果IO资源没有准备好，那么程序该如何处理的问题: 前者等待；后者继续执行(并且使用线程一直轮询，直到有IO资源准备好了)

- **同步IO 和 非同步IO**

这两个概念是**操作系统级别**的。主要描述的是操作系统在收到程序请求IO操作后，如果IO资源没有准备好，该如何响应程序的问题: 前者不响应，直到IO资源准备好以后；后者返回一个标记(好让程序和自己知道以后的数据往哪里通知)，当IO资源准备好以后，再用事件机制返回给程序。

#### 什么是Linux的IO模型？

网络IO的本质是socket的读取，socket在linux系统被抽象为流，IO可以理解为对流的操作。刚才说了，对于一次IO访问（以read举例），**数据会先被拷贝到操作系统内核的缓冲区中，然后才会从操作系统内核的缓冲区拷贝到应用程序的地址空间**。所以说，当一个read操作发生时，它会经历两个阶段：

- 第一阶段：等待数据准备 (Waiting for the data to be ready)。
- 第二阶段：将数据从内核拷贝到进程中 (Copying the data from the kernel to the process)。

对于socket流而言，

- 第一步：通常涉及等待网络上的数据分组到达，然后被复制到内核的某个缓冲区。
- 第二步：把数据从内核缓冲区复制到应用进程缓冲区。

网络应用需要处理的无非就是两大类问题，网络IO，数据计算。相对于后者，网络IO的延迟，给应用带来的性能瓶颈大于后者。网络IO的模型大致有如下几种：

1.  同步阻塞IO（bloking IO）
2.  同步非阻塞IO（non-blocking IO）
3.  多路复用IO（multiplexing IO）
4.  信号驱动式IO（signal-driven IO）
5.  异步IO（asynchronous IO）

![](https://www.pdai.tech/images/io/java-io-compare.png)

PS: 这块略复杂，在后面的提供了问答，所以用了最简单的举例结合Linux IO图例帮你快速理解。@pdai

#### 什么是同步阻塞IO？

应用进程被阻塞，直到数据复制到应用进程缓冲区中才返回。

- **举例理解**

你早上去买有现炸油条，你点单，之后一直等店家做好，期间你啥其它事也做不了。（你就是应用级别，店家就是操作系统级别， 应用被阻塞了不能做其它事）

- **Linux 中IO图例**

![](https://www.pdai.tech/images/io/java-io-model-0.png)

#### 什么是同步非阻塞IO？

应用进程执行系统调用之后，内核返回一个错误码。应用进程可以继续执行，但是需要不断的执行系统调用来获知 I/O 是否完成，这种方式称为轮询(polling)。

- **举例理解**

你早上去买现炸油条，你点单，点完后每隔一段时间询问店家有没有做好，期间你可以做点其它事情。（你就是应用级别，店家就是操作系统级别，应用可以做其它事情并通过轮询来看操作系统是否完成）

- **Linux 中IO图例**

![](https://www.pdai.tech/images/io/java-io-model-1.png)

#### 什么是多路复用IO？

系统调用可能是由多个任务组成的，所以可以拆成多个任务，这就是多路复用。

- **举例理解**

你早上去买现炸油条，点单收钱和炸油条原来都是由一个人完成的，现在他成了瓶颈，所以专门找了个收银员下单收钱，他则专注在炸油条。（本质上炸油条是耗时的瓶颈，将他职责分离出不是瓶颈的部分，比如下单收银，对应到系统级别也时一样的意思）

- **Linux 中IO图例**

使用 select 或者 poll 等待数据，并且可以等待多个套接字中的任何一个变为可读，这一过程会被阻塞，当某一个套接字可读时返回。之后再使用 recvfrom 把数据从内核复制到进程中。

它可以让单个进程具有处理多个 I/O 事件的能力。又被称为 Event Driven I/O，即事件驱动 I/O。

![](https://www.pdai.tech/images/io/java-io-model-2.png)

#### 有哪些多路复用IO？

目前流程的多路复用IO实现主要包括四种: `select`、`poll`、`epoll`、`kqueue`。下表是他们的一些重要特性的比较:

| IO模型 | 相对性能 | 关键思路         | 操作系统      | JAVA支持情况                                                 |
| ------ | -------- | ---------------- | ------------- | ------------------------------------------------------------ |
| select | 较高     | Reactor          | windows/Linux | 支持,Reactor模式(反应器设计模式)。Linux操作系统的 kernels 2.4内核版本之前，默认使用select；而目前windows下对同步IO的支持，都是select模型 |
| poll   | 较高     | Reactor          | Linux         | Linux下的JAVA NIO框架，Linux kernels 2.6内核版本之前使用poll进行支持。也是使用的Reactor模式 |
| epoll  | 高       | Reactor/Proactor | Linux         | Linux kernels 2.6内核版本及以后使用epoll进行支持；Linux kernels 2.6内核版本之前使用poll进行支持；另外一定注意，由于Linux下没有Windows下的IOCP技术提供真正的 异步IO 支持，所以Linux下使用epoll模拟异步IO |
| kqueue | 高       | Proactor         | Linux         | 目前JAVA的版本不支持                                         |

多路复用IO技术最适用的是“高并发”场景，所谓高并发是指1毫秒内至少同时有上千个连接请求准备好。其他情况下多路复用IO技术发挥不出来它的优势。另一方面，使用JAVA NIO进行功能实现，相对于传统的Socket套接字实现要复杂一些，所以实际应用中，需要根据自己的业务需求进行技术选择。

#### 什么是信号驱动IO？

应用进程使用 sigaction 系统调用，内核立即返回，应用进程可以继续执行，也就是说等待数据阶段应用进程是非阻塞的。内核在数据到达时向应用进程发送 SIGIO 信号，应用进程收到之后在信号处理程序中调用 recvfrom 将数据从内核复制到应用进程中。

相比于非阻塞式 I/O 的轮询方式，信号驱动 I/O 的 CPU 利用率更高。

- **举例理解**

你早上去买现炸油条，门口排队的人多，现在引入了一个叫号系统，点完单后你就可以做自己的事情了，然后等叫号就去拿就可以了。（所以不用再去自己频繁跑去问有没有做好了）

- **Linux 中IO图例**

![](https://www.pdai.tech/images/io/java-io-model-3.png)

#### 什么是异步IO？

相对于同步IO，异步IO不是顺序执行。用户进程进行aio_read系统调用之后，无论内核数据是否准备好，都会直接返回给用户进程，然后用户态进程可以去做别的事情。等到socket数据准备好了，内核直接复制数据给进程，然后从内核向进程发送通知。IO两个阶段，进程都是非阻塞的。

- **举例理解**

你早上去买现炸油条， 不用去排队了，打开美团外卖下单，然后做其它事，一会外卖自己送上门。(你就是应用级别，店家就是操作系统级别, 应用无需阻塞，这就是非阻塞；系统还可能在处理中，但是立刻响应了应用，这就是异步)

- **Linux 中IO图例**

（Linux提供了AIO库函数实现异步，但是用的很少。目前有很多开源的异步IO库，例如libevent、libev、libuv）

![](https://www.pdai.tech/images/io/java-io-model-4.png)

#### 什么是Reactor模型？

大多数网络框架都是基于Reactor模型进行设计和开发，Reactor模型基于事件驱动，特别适合处理海量的I/O事件。

- **传统的IO模型**？

这种模式是传统设计，每一个请求到来时，大致都会按照：请求读取->请求解码->服务执行->编码响应->发送答复 这个流程去处理。

![](https://www.pdai.tech/images/io/java-io-reactor-1.png)

服务器会分配一个线程去处理，如果请求暴涨起来，那么意味着需要更多的线程来处理该请求。若请求出现暴涨，线程池的工作线程数量满载那么其它请求就会出现等待或者被抛弃。若每个小任务都可以使用非阻塞的模式，然后基于异步回调模式。这样就大大提高系统的吞吐量，这便引入了Reactor模型。

- **Reactor模型中定义的三种角色**：

1.  **Reactor**：负责监听和分配事件，将I/O事件分派给对应的Handler。新的事件包含连接建立就绪、读就绪、写就绪等。
2.  **Acceptor**：处理客户端新连接，并分派请求到处理器链中。
3.  **Handler**：将自身与事件绑定，执行非阻塞读/写任务，完成channel的读入，完成处理业务逻辑后，负责将结果写出channel。可用资源池来管理。

- **单Reactor单线程模型**

Reactor线程负责多路分离套接字，accept新连接，并分派请求到handler。Redis使用单Reactor单进程的模型。

![](https://www.pdai.tech/images/io/java-io-reactor-2.png)

消息处理流程：

1.  Reactor对象通过select监控连接事件，收到事件后通过dispatch进行转发。
2.  如果是连接建立的事件，则由acceptor接受连接，并创建handler处理后续事件。
3.  如果不是建立连接事件，则Reactor会分发调用Handler来响应。
4.  handler会完成read->业务处理->send的完整业务流程。

- **单Reactor多线程模型**

将handler的处理池化。

![](https://www.pdai.tech/images/io/java-io-reactor-3.png)

- **多Reactor多线程模型**

主从Reactor模型： 主Reactor用于响应连接请求，从Reactor用于处理IO操作请求，读写分离了。

![](https://www.pdai.tech/images/io/java-io-reactor-4.png)

#### 什么是Java NIO？

NIO主要有三大核心部分：Channel(通道)，Buffer(缓冲区), Selector。**传统IO基于字节流和字符流进行操作**，而**NIO基于Channel和Buffer(缓冲区)进行操作**，数据总是从通道读取到缓冲区中，或者从缓冲区写入到通道中。Selector(选择区)用于监听多个通道的事件（比如：连接打开，数据到达）。因此，单个线程可以监听多个数据通道。

NIO和传统IO（一下简称IO）之间第一个最大的区别是，IO是面向流的，NIO是面向缓冲区的。

![](https://www.pdai.tech/images/io/java-io-nio-x.png)