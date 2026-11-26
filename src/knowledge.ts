import type { FigureNote, Question } from './types';

export const figureNotes: Record<string, FigureNote> = {
  'dijkstra-table.png': { title: 'Dijkstra：每次选最近的未确定点', caption: '最短路不是一次猜到终点，而是把已经确定的范围一圈圈扩大。', plain: '把起点想成水滴，距离沿着道路向外扩散。每轮挑当前离起点最近、还没盖章的地点，再用它更新邻居的距离。盖过章的地点不再变；“松弛”就是检查绕路有没有更短。' },
  'dijkstra-graph.png': { title: '带权图里的“最便宜路线”', caption: '边上的数字是走这段路的代价，路线长度是沿路数字相加。', plain: '像规划公交换乘：不只看站数，也要加上每段费用。候选路线中先确定代价最小的一站，后续只可能让还没确定的站变得更便宜。' },
  'critical-path.png': { title: '关键路径：决定项目最短工期的链条', caption: '一项活动晚了，会不会拖慢整个项目，要看它有没有时间余量。', plain: '把项目看成几条并行施工路线。最慢的完整路线决定完工时间。活动最早能开始时间往前推；最迟允许开始时间往后倒推。两者相同、没有余量的活动就在关键路径上。' },
  'topological-sort.png': { title: '拓扑排序：先完成所有前置任务', caption: '只有入度为 0 的结点，当前才没有尚未完成的前置条件。', plain: '像排课程先修顺序：先找没有先修课的课程，选出后删掉它发出的依赖，再继续找新的“没有前置任务”的课程。如果最后还剩下任务，说明有循环依赖。' },
  'single-bus-datapath.png': { title: '单总线数据通路：同一时刻谁来用总线', caption: '每个时钟拍都要写清数据从哪里来、经过什么部件、最后写到哪里。', plain: '把总线想成一条窄窄的单车道。同一拍通常只能有一个部件把数据放上去；其他部件可以接收。读指令、送入寄存器、交给运算器，都要按拍分开安排。' },
  'single-cycle-datapath.png': { title: '单周期 CPU：一条指令经过哪些部件', caption: '控制器根据指令决定数据通路中的开关和数据来源。', plain: '像一条小型流水线：取指令、读寄存器、计算地址或结果、访问内存、写回结果。单周期设计把整条指令放进一个时钟周期里，所以周期要足够长，容下最慢的那类指令。' },
  'interrupt-priority.png': { title: '中断优先级：谁先得到处理', caption: '多个请求同时到来时，按优先规则决定处理顺序。', plain: '把中断想成排队求助。优先级高的请求先服务；服务过程中要保存被打断的位置，处理完再返回。屏蔽位决定某些请求是否暂时可以打断当前工作。' },
  'LRU-trace.png': { title: 'LRU：淘汰最久没用过的页面', caption: '命中时刷新“最近使用”时间；缺页时替换最久未访问的一页。', plain: '书桌上只有几个位置。每次翻开一本书，就把它记为“刚用过”；桌面满了又要放新书，就收走最久没碰过的那本。关键是按访问先后更新，而不是看页号大小。' },
  'CLOCK-trace.png': { title: 'CLOCK：用访问位近似 LRU', caption: '指针绕着页面转，给最近访问过的页面一次“第二次机会”。', plain: '每页有个访问标记。指针遇到标记为 1 的页面，就把它改成 0 并往前走；遇到 0 才替换。这样不用精确记录每次访问时间，也能大致保护刚用过的页面。' },
  'os-io-stack.png': { title: 'I/O 软件层次：请求逐层传递', caption: '应用程序通过系统调用向下请求设备服务，完成后结果再返回。', plain: '像寄快递：应用说明要做什么，操作系统检查权限和参数，设备驱动把通用请求翻译成设备能懂的命令，控制器最后驱动硬件。完成后通过中断或状态查询把结果送回来。' },
  'process-states.png': { title: '进程状态：运行、就绪与等待', caption: '进程因为等 CPU 或等事件而切换状态。', plain: '就绪表示“准备好了，等 CPU”；运行表示“正在用 CPU”；阻塞表示“还在等某件事，比如 I/O”。事件完成会从阻塞回到就绪；时间片用完则从运行回到就绪。' },
  'CSMA-CD.png': { title: '共享信道：先监听，再发送或退避', caption: '多台设备共用线路时，要处理同时发送造成的冲突。', plain: '像多人共用对讲机：先听有没有人在说；空闲再说。若有线网络检测到碰撞，就停止发送、等待随机时间再试。无线网络难以边发送边听，所以通常采用避免冲突的办法。' },
  'TCP-handshake.png': { title: 'TCP 三次握手：双方确认都能收发', caption: 'SYN、SYN+ACK、ACK 让两端交换初始序号并确认连接。', plain: '客户端先问“可以建立吗”；服务器回答“可以，我也准备好了”；客户端再确认收到。序号用来给字节编号，SYN 自己也会占用一个序号。' },
  'TCP-close.png': { title: 'TCP 释放：两边分别结束发送', caption: '每一方向的发送结束，都需要对应的 FIN 与 ACK。', plain: '连接两端各自管理自己的发送方向，所以结束时通常一边先说“我发完了”，另一边确认；等另一边也发完，再确认一次。FIN 会消耗一个序号，因此确认号会加一。' },
  'GBN-window.png': { title: 'GBN：累计确认，超时后回退重传', caption: '接收方只接收按序帧；丢失时发送方可能重发窗口内后续帧。', plain: '收件人只认连续编号：缺了 2，即使 3、4 到了也暂时不能交付。确认号表示“下一个我想要的编号”。最早未确认的帧超时后，发送方从那里重新发送。' },
  'SR-window.png': { title: 'SR：每帧单独确认并缓存乱序帧', caption: '接收方可以暂存后到的帧，缺失的帧补齐后再按序交付。', plain: '收件人可以先把 3 放一边，同时单独告诉发送方“3 收到了”。2 到达后，再把 2 和缓存的 3 一起交付。窗口大小还要受序号范围限制，避免新旧编号混淆。' },
  'DNS-hierarchy.png': { title: 'DNS：从域名逐层找到 IP', caption: '解析器根据委派关系继续查询，最终取得目标域名对应的记录。', plain: '像逐级问路：先问根目录该去哪个顶级域，再问顶级域该去哪个权威服务器，最后由权威服务器回答 IP。缓存可以让近期问过的问题少走几步。' },
};

const defaultFigure: Record<string, string> = {
  数据结构: 'topological-sort.png',
  计算机组成原理: 'single-cycle-datapath.png',
  操作系统: 'process-states.png',
  计算机网络: 'TCP-handshake.png',
};

export function figuresFor(question: Question) {
  if (question.figures.length) return question.figures;
  const match = Object.entries({
    'critical-path': 'critical-path.png', dijkstra: 'dijkstra-table.png', topological: 'topological-sort.png',
    heap: 'topological-sort.png', sorting: 'topological-sort.png', LRU: 'LRU-trace.png', CLOCK: 'CLOCK-trace.png',
    process: 'process-states.png', interrupt: 'interrupt-priority.png', cpu: 'single-cycle-datapath.png',
    datapath: 'single-bus-datapath.png', tcp: 'TCP-handshake.png', window: 'GBN-window.png', csma: 'CSMA-CD.png',
    dns: 'DNS-hierarchy.png',
  }).find(([key]) => question.family.toLowerCase().includes(key.toLowerCase()) || question.familyTitle.toLowerCase().includes(key.toLowerCase()));
  return [match?.[1] ?? defaultFigure[question.subject]];
}
