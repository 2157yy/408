import { useState } from 'react';

type Demo = { id: string; title: string; subject: string; intro: string; kind: 'graph' | 'array' | 'frames' | 'states' | 'protocol' | 'cpu' | 'timeline' | 'buffer'; steps: { title: string; text: string }[] };

const demos: Demo[] = [
  { id: 'dijkstra', title: 'Dijkstra：最短路怎样长出来', subject: '数据结构 · 图算法', intro: '跟着距离最短的未确定顶点向外扩展。每一步都比较“原来的距离”和“经过当前顶点的距离”。', kind: 'graph', steps: [{ title: '给起点盖章', text: '从 1 号点出发。到 2 号的暂定距离是 10，到 5 号是 5，其余还不知道。' }, { title: '先走到最近的点 5', text: '当前最小距离是 5。经过 5 去 4 号只要 7，比原先的无穷小，于是更新为 7。' }, { title: '检查点 4 的邻居', text: '到 4 的距离是 7，经过它到 3 号是 13。先把 3 号的暂定距离记为 13。' }, { title: '绕路让 2 号更近', text: '经过 2 号到 3 号需要 9，比 13 短，所以把 3 号距离改为 9。' }, { title: '每个点都确定', text: '每轮取最小的未确定距离；所有点盖章后，沿前驱记录就能还原最短路径。' }] },
  { id: 'routing', title: '路由表：最长前缀匹配怎样选出口', subject: '计算机网络 · 路由转发', intro: '路由器收到目的 IP 后，把它和所有可匹配的网络比较，选择最具体的一条路由。', kind: 'states', steps: [{ title: '读出目的 IP', text: '先拿到数据包的目的地址。路由器转发时主要查目的 IP，不查主机名。' }, { title: '找出所有匹配项', text: '把目的 IP 与路由表中的网络前缀逐项比较，默认路由也作为候选项。' }, { title: '选前缀最长的一项', text: '多条路由都能匹配时，掩码位数更多的网络更具体，优先级更高。' }, { title: '确定下一跳并转发', text: '按选中的路由确定出接口/下一跳；转发到下一台路由器后再查一次。' }] },
  { id: 'topological', title: '拓扑排序：先做没有前置的任务', subject: '数据结构 · 有向无环图', intro: '每次选一个入度为 0 的顶点，输出后删除它的出边。', kind: 'graph', steps: [{ title: '数每个点的入度', text: '入度表示还有多少条依赖指向这个任务。入度为 0 的任务可以马上开始。' }, { title: '先完成 A', text: 'A 没有前置任务，把它放到序列里，并删除 A 指向其他任务的边。' }, { title: '解锁 B 和 C', text: '删边后，B、C 的前置条件满足了。任选一个继续，拓扑序可能不止一种。' }, { title: '检查是否有环', text: '如果还有顶点却没有入度为 0 的点，剩下的依赖互相绕成环，无法得到完整拓扑序。' }] },
  { id: 'critical', title: '关键路径：哪些活动不能拖', subject: '数据结构 · AOE 网', intro: '向前推最早时间，向后推最迟时间；没有时间余量的活动会卡住整个工期。', kind: 'graph', steps: [{ title: '先算最早发生时间 ve', text: '从源点开始向前。一个事件要等所有前置活动都完成，因此前推时取路径中的最大值。' }, { title: '再算最迟发生时间 vl', text: '从汇点开始向后，找还能不延误总工期的最晚时刻。逆推时对后续约束取最小值。' }, { title: '对比每个活动', text: '活动最早开始 e=ve[起点]，最迟开始 l=vl[终点]−活动时长。' }, { title: '余量为 0 就是关键活动', text: 'l−e=0 表示没有缓冲时间。把连续的关键活动连起来就是关键路径。' }] },
  { id: 'insertion', title: '直接插入排序：把新数插进有序区', subject: '数据结构 · 排序', intro: '每一轮让左边多一个有序元素；新元素沿着有序区向左寻找位置。', kind: 'array', steps: [{ title: '把第一个数当作有序区', text: '只有一个元素时，左侧天然有序。后面的元素逐个插入。' }, { title: '取出下一个数', text: '暂存这个数，从有序区最右边往左比较。比它大的元素向右移动。' }, { title: '找到插入位置', text: '遇到不大于它的值就停下，把暂存数放到空出来的位置。' }, { title: '扩大有序前缀', text: '每轮结束后，有序区长度加一。相同元素不越过彼此时，算法保持稳定。' }] },
  { id: 'heap', title: '大根堆：堆顶总是当前最大值', subject: '数据结构 · 堆', intro: '父结点不小于孩子。调整时先放到末尾，再沿着父子关系修复堆序。', kind: 'array', steps: [{ title: '先看父子关系', text: '大根堆要求每个父结点都不小于左右孩子，但堆内的叶子之间没有排序保证。' }, { title: '取走堆顶最大值', text: '把最大值放进有序区，再用堆末尾元素补到根结点。' }, { title: '沿较大的孩子下沉', text: '比较两个孩子，选较大的那个与父结点交换，继续向下检查。' }, { title: '堆区缩小一格', text: '重复取堆顶和下沉。堆区不断变小，有序区不断变大。' }] },
  { id: 'lru', title: 'LRU：桌面满了就收走最久没用的', subject: '操作系统 · 页面置换', intro: '每次访问后更新“最近使用”次序。发生缺页且空间用完时，替换最久未访问页。', kind: 'frames', steps: [{ title: '读入 7', text: '空页面框装入 7。最近使用顺序：7。' }, { title: '读入 0 和 1', text: '页面框还有空间，依次装入 0、1。最新的放到次序表前面。' }, { title: '读入 2，发生置换', text: '页面框满了。7 最早访问，淘汰 7 并装入 2。' }, { title: '再次访问 0，命中', text: '0 已在内存，不需要换页，但它变成最近使用的页面。' }, { title: '读入 3，淘汰 1', text: '现在 1 最久没用，替换它。每次都要根据访问记录刷新次序。' }] },
  { id: 'clock', title: 'CLOCK：给刚访问过的页一次机会', subject: '操作系统 · 页面置换', intro: '循环指针检查访问位。访问位为 1 时清零并跳过；遇到 0 才替换。', kind: 'frames', steps: [{ title: '指针停在页面 0', text: '访问位是 1，表示最近用过。先把它清成 0，给它一次“第二次机会”。' }, { title: '继续检查页面 1', text: '页面 1 也刚访问过，清零后指针继续向前。' }, { title: '遇到访问位为 0', text: '页面 2 没有近期访问记录，是当前候选牺牲页。' }, { title: '替换并移动指针', text: '新页面装入当前位置，访问位初始化为 1，指针移到下一个框。' }] },
  { id: 'process', title: '进程状态：它为什么停下来', subject: '操作系统 · 进程管理', intro: '运行、就绪、阻塞代表三种不同的等待原因，事件决定状态如何切换。', kind: 'states', steps: [{ title: '运行：正在使用 CPU', text: '调度程序把 CPU 分配给一个就绪进程，它进入运行状态。' }, { title: '时间片用完', text: '进程还没结束但需要让出 CPU，于是回到就绪队列等待下一轮。' }, { title: '等待 I/O', text: '运行中的进程发出 I/O 请求，无法继续计算，转入阻塞状态。' }, { title: 'I/O 完成', text: '等待的事件发生了，进程不再阻塞，回到就绪队列而不是直接运行。' }] },
  { id: 'interrupt', title: '中断响应：保存现场后再处理请求', subject: '组成原理 · 中断系统', intro: 'CPU 响应中断时先保护断点和现场，再跳到服务程序；处理结束后恢复执行。', kind: 'states', steps: [{ title: '设备发出中断请求', text: 'I/O 设备完成工作后提出请求。CPU 会在允许响应的指令边界检查请求。' }, { title: '判断优先级与屏蔽位', text: '多个请求同时到来时，按优先级和当前屏蔽状态判断是否响应。' }, { title: '保存断点与必要现场', text: 'CPU 保存返回位置以及后续恢复所需的状态，避免处理完中断后找不到原来的执行位置。' }, { title: '执行服务程序并返回', text: '跳到对应的中断服务程序。结束后恢复现场，从被打断的位置继续。' }] },
  { id: 'cpu', title: 'CPU 取指与执行：数据沿通路移动', subject: '组成原理 · 数据通路', intro: '一步步观察 PC、MAR、MDR、IR 和寄存器怎样配合完成指令。', kind: 'cpu', steps: [{ title: 'PC → MAR', text: '程序计数器把当前指令地址送到存储器地址寄存器。' }, { title: '主存读 → MDR', text: '存储器按这个地址读出指令，暂存在 MDR。' }, { title: 'MDR → IR', text: '指令进入指令寄存器，控制器开始译码。' }, { title: '寄存器 → ALU', text: '操作数送到运算器，控制信号选择加、减或逻辑运算。' }, { title: '结果写回', text: 'ALU 结果写入目标寄存器；PC 更新为下一条指令地址。' }] },
  { id: 'tcp', title: 'TCP 三次握手：双方都确认可达', subject: '计算机网络 · TCP', intro: '报文在客户端与服务器之间往返，状态随 SYN 和 ACK 变化。', kind: 'protocol', steps: [{ title: '客户端发送 SYN', text: '客户端请求连接，带上自己的初始序号 x，状态转到 SYN-SENT。' }, { title: '服务器回复 SYN+ACK', text: '服务器确认 x+1，并发出自己的初始序号 y，状态进入 SYN-RCVD。' }, { title: '客户端发送 ACK', text: '客户端确认 y+1。双方都知道对方能收也能发，进入 ESTABLISHED。' }] },
  { id: 'tcp-close', title: 'TCP 释放：两个方向分别关门', subject: '计算机网络 · TCP', intro: '双方的发送方向各自结束，所以通常需要 FIN、ACK、FIN、ACK。', kind: 'protocol', steps: [{ title: '主动方 FIN', text: '主动关闭的一方表示自己已发完，FIN 占用一个序号。' }, { title: '对方 ACK', text: '另一方确认收到了 FIN，但仍可能继续发送还没发完的数据。' }, { title: '对方 FIN', text: '对方也完成发送后，再单独用 FIN 结束自己的方向。' }, { title: '最后 ACK', text: '主动方确认对方的 FIN，等待一段时间后释放连接。' }] },
  { id: 'gbn', title: 'GBN：丢一帧后从缺口回退', subject: '计算机网络 · 可靠传输', intro: '累计确认表示连续收到哪里了；超时从最早未确认帧开始重传。', kind: 'protocol', steps: [{ title: '发送窗口发出 0–3', text: '窗口允许发送多个连续帧，不用每发一帧就停下来等。' }, { title: '帧 2 丢失', text: '接收方收到了 0、1，却发现后续帧不连续，于是丢弃后面的帧。' }, { title: '重复确认 2', text: '累计确认号表示“下一个期待 2”。发送方知道缺口还没补上。' }, { title: '超时，重传 2 和后续帧', text: '最早未确认帧超时，发送方从 2 开始回退重传，直到窗口内的帧连续到达。' }] },
  { id: 'sr', title: 'SR：单独确认，先把乱序帧存好', subject: '计算机网络 · 可靠传输', intro: '选择重传允许接收方缓存乱序帧，也允许发送方只重传缺失的一帧。', kind: 'protocol', steps: [{ title: '发送 0、1、2、3', text: '多个帧可以同时在路上，不必等待前一帧的确认。' }, { title: '帧 2 丢失，3 到达', text: '接收方把 3 暂存在缓冲区，同时单独确认 3。' }, { title: '只重传帧 2', text: '发送方没有收到 2 的确认，等 2 的计时器超时后只补发 2。' }, { title: '按序交付 2 和 3', text: '缺口补齐后，接收方把缓存中的连续帧一起交给上层。' }] },
  { id: 'csma', title: 'CSMA/CA：先等一等，再随机退避', subject: '计算机网络 · 介质访问控制', intro: '无线设备难以一边发送一边检测碰撞，因此用等待和确认来减少冲突。', kind: 'timeline', steps: [{ title: '先监听信道', text: '如果信道忙，先等到空闲；空闲后还要等待规定的间隔。' }, { title: '随机选择退避槽', text: '设备从随机窗口里选一个等待时长。计数到 0 才开始发送。' }, { title: '信道再次忙就暂停计数', text: '其他设备开始发送时，退避计数冻结；信道恢复空闲后再继续倒数。' }, { title: '收到 ACK 才算成功', text: '若没有确认，设备认为可能发生冲突，扩大随机窗口后重试。' }] },
  { id: 'dns', title: 'DNS：沿着层级问到权威答案', subject: '计算机网络 · 域名解析', intro: '根、顶级域、权威 DNS 逐层指路，最终找到目标记录。', kind: 'states', steps: [{ title: '先查本地缓存', text: '浏览器和操作系统先找最近保存的答案，命中就不需要继续查询。' }, { title: '询问根 DNS', text: '根服务器不一定知道最终 IP，但可以指向对应的顶级域服务器。' }, { title: '询问顶级域服务器', text: '例如 .com 服务器会告诉解析器负责具体域名的权威服务器。' }, { title: '权威服务器给出记录', text: '最终取得 A 或 AAAA 等记录，解析器把结果缓存后交还应用。' }] },
  { id: 'pv', title: 'PV：空位与已有数据要互相配合', subject: '操作系统 · 信号量', intro: '有界缓冲区用 empty、full 和 mutex 同时控制容量与互斥访问。', kind: 'buffer', steps: [{ title: '初始化三个信号量', text: '缓冲区容量为 N 时，empty=N、full=0、mutex=1。' }, { title: '生产者先申请空位', text: 'P(empty) 确认还有空间，P(mutex) 确保同一时刻只有一个进程修改缓冲区。' }, { title: '写入后通知消费者', text: '写完释放互斥锁 V(mutex)，再 V(full) 表示多了一个可消费的数据。' }, { title: '消费者取出并归还空位', text: '消费者先 P(full)、P(mutex)，取走数据后释放锁，并 V(empty) 归还一个空位。' }] },
];

function GraphScene({ step }: { step: number }) {
  const nodes = [{ x: 90, y: 82, t: '1' }, { x: 220, y: 35, t: '2' }, { x: 220, y: 130, t: '5' }, { x: 358, y: 36, t: '3' }, { x: 358, y: 129, t: '4' }, { x: 482, y: 82, t: '6' }];
  const edges = [[0, 1, '10'], [0, 2, '5'], [2, 1, '3'], [1, 3, '1'], [2, 4, '2'], [4, 3, '6'], [3, 5, '4'], [4, 5, '3']] as const;
  const active = Math.min(step + 1, edges.length);
  return <svg className="scene-svg graph-scene" viewBox="0 0 540 170" role="img" aria-label="逐步变化的有向图"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L0 6 L7 3 z" fill="currentColor" /></marker></defs>{edges.map(([a,b,w],i) => <g key={i} className={`graph-edge ${i < active ? 'lit' : ''}`}><line x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} markerEnd="url(#arrow)"/><text x={(nodes[a].x+nodes[b].x)/2} y={(nodes[a].y+nodes[b].y)/2-7}>{w}</text></g>)}{nodes.map((n,i)=><g className={`graph-node ${i===step%nodes.length?'hot':''} ${i<Math.max(0,step-1)?'settled':''}`} key={n.t}><circle cx={n.x} cy={n.y} r="21"/><text x={n.x} y={n.y+5}>{n.t}</text></g>)}<text className="scene-caption" x="12" y="160">候选距离逐步更新 · 每一轮只确定一个新顶点</text></svg>;
}

function ArrayScene({ step, id }: { step: number; id: string }) {
  const values = id === 'heap' ? [9, 7, 8, 2, 5, 3] : [3, 8, 4, 6, 1, 7];
  const sorted = id === 'heap' ? Math.max(1, step) : Math.max(1, step + 1);
  return <div className="array-scene" aria-label="数组排序状态"><div className="array-label">{id === 'heap' ? '堆区' : '已排序前缀'} <span>每一步只调整局部数据</span></div><div className="array-bars">{values.map((v,i)=><div className={`array-cell ${i < sorted ? 'sorted' : ''} ${i === Math.min(step+1,values.length-1) ? 'active' : ''}`} key={i}><div className="bar" style={{ height: `${24 + v * 8}px` }} /><b>{v}</b><small>{i}</small></div>)}</div></div>;
}

function FramesScene({ step, id }: { step: number; id: string }) {
  const pages = id === 'clock' ? ['2','0','4','1'] : ['7','0','1','2','0','3','0','4'];
  const shown = Math.min(step + 1, pages.length);
  const frames = id === 'clock' ? ['2','0','4','1'] : ['2','0',step >= 4 ? '3' : '1'];
  return <div className="frames-scene"><div className="frame-sequence"><span>访问序列</span>{pages.map((p,i)=><b className={i===step?'active':''} key={i}>{p}</b>)}</div><div className="memory-frames"><span>内存页框</span>{frames.map((p,i)=><div className={`memory-frame ${i===step%frames.length?'hot':''}`} key={i}><small>FRAME {i}</small><b>{step>=shown-1?p:'·'}</b>{id==='clock'&&<i>{i<step%frames.length?'0':'1'}</i>}</div>)}</div><div className="pointer-line">{id==='clock' ? <>↻ 时钟指针每次检查一页，访问位 <b>1 → 0</b> 就给它第二次机会。</> : <>命中只更新最近访问次序；缺页时才替换页面。</>}</div></div>;
}

function ProtocolScene({ step, id }: { step: number; id: string }) {
  const close = id === 'tcp-close'; const labels = close ? ['FIN','ACK','FIN','ACK'] : id==='gbn' ? ['0','1','2×','3','重传2','重传3'] : id==='sr' ? ['0','1','2×','3','ACK3','重传2'] : ['SYN','SYN + ACK','ACK'];
  return <div className="protocol-scene"><div className="endpoint">客户端<span>{close ? step>=4?'CLOSED':step?'FIN-WAIT':'ESTABLISHED' : id==='tcp'?(step>=3?'ESTABLISHED':step?'SYN-SENT':'CLOSED'):'发送方'}</span></div><div className="wire"><div className="wire-center">{labels.slice(0,Math.min(step+1,labels.length)).map((label,i)=><div key={`${i}-${label}`} className={`packet ${i%2?'reverse':''}`} style={{ animationDelay: `${i*.08}s` }}><span>{label}</span><i /></div>)}</div><div className="wire-label">{id==='gbn'?'累计确认 · 超时重传':id==='sr'?'独立确认 · 缓存乱序帧':'双向序号与状态'}</div></div><div className="endpoint server">服务器<span>{close ? step>=4?'CLOSED':step>=3?'LAST-ACK':'CLOSE-WAIT' : id==='tcp'?(step>=3?'ESTABLISHED':step>=2?'SYN-RCVD':'LISTEN'):'接收方'}</span></div></div>;
}

function StateScene({ step, id }: { step: number; id: string }) {
  const titles = id==='process' ? ['就绪','运行','阻塞'] : id==='routing' ? ['目的 IP','路由表','最长前缀','下一跳'] : id==='interrupt' ? ['请求','判优先级','保存现场','服务返回'] : ['本机缓存','根 DNS','顶级域','权威 DNS'];
  const labels = id==='process' ? ['等待 CPU','使用 CPU','等待 I/O'] : id==='routing' ? ['要去哪里','找匹配项','选更具体项','发往出口'] : id==='interrupt' ? ['设备请求','允许响应','保存断点','恢复执行'] : ['找到答案？','去问 .com','找到负责人','返回 IP'];
  return <div className="state-scene">{titles.map((t,i)=><div className="state-column" key={t}><div className={`state-node ${step===i?'active':''} ${i<step?'visited':''}`}>{i+1}</div><b>{t}</b><span>{labels[i]}</span></div>)}<div className="state-track"><span style={{ left: `${Math.min(step, titles.length-1)* (80/(titles.length-1))}%` }} /></div></div>;
}

function CpuScene({ step }: { step: number }) {
  const labels = ['PC','MAR','主存','MDR','IR','控制器'];
  return <div className="cpu-scene"><div className="cpu-flow">{labels.map((label,i)=><div className={`cpu-block ${i===step?'active':''} ${i<step?'visited':''}`} key={label}><span>{['⌖','▤','▦','↔','▣','⚙'][i]}</span><b>{label}</b></div>)}</div><div className="cpu-bus"><span style={{ width: `${Math.max(10, (step+1)/labels.length*100)}%` }} /></div><p>当前微操作：<b>{['地址送往 MAR','读取主存中的指令','指令暂存在 MDR','指令装入 IR','控制器译码字段','发出控制信号'][step]}</b></p></div>;
}

function TimelineScene({ step }: { step: number }) {
  return <div className="timeline-scene"><div className="channel"><span>设备 A</span><div className="time-ruler"><i className={step>=0?'active':''}>监听</i><i className={step>=1?'active':''}>DIFS</i><i className={step>=2?'active':''}>退避槽</i><i className={step>=3?'active':''}>DATA →</i><i className={step>=4?'active':''}>← ACK</i></div></div><div className="channel second"><span>设备 B</span><div className="time-ruler"><i className={step>=2?'wait':''}>暂停计数</i><i className={step>=3?'active':''}>等待空闲</i><i className={step>=4?'active':''}>继续发送</i></div></div><div className="timeline-axis"><span>时间</span><i>→</i></div></div>;
}

function BufferScene({ step }: { step: number }) {
  const count = Math.min(3, step);
  return <div className="buffer-scene"><div className="semaphore"><span>empty</span><b>{3-count}</b><small>可用空位</small></div><div className="buffer-cells">{[0,1,2].map(i=><div className={i<count?'filled':''} key={i}>{i<count?<span>●</span>:<span>＋</span>}</div>)}</div><div className="semaphore"><span>full</span><b>{count}</b><small>可读数据</small></div></div>;
}

function Scene({ demo, step }: { demo: Demo; step: number }) {
  if (demo.kind==='graph') return <GraphScene step={step}/>;
  if (demo.kind==='array') return <ArrayScene step={step} id={demo.id}/>;
  if (demo.kind==='frames') return <FramesScene step={step} id={demo.id}/>;
  if (demo.kind==='protocol') return <ProtocolScene step={step} id={demo.id}/>;
  if (demo.kind==='states') return <StateScene step={step} id={demo.id}/>;
  if (demo.kind==='cpu') return <CpuScene step={step}/>;
  if (demo.kind==='timeline') return <TimelineScene step={step}/>;
  return <BufferScene step={step}/>;
}

export function AnimationLab({ initialDemo = 'dijkstra' }: { initialDemo?: string }) {
  const [selected, setSelected] = useState(initialDemo);
  const [step, setStep] = useState(0);
  const demo = demos.find((d) => d.id === selected)!;
  const stage = Math.min(step, demo.steps.length - 1);
  const selectDemo = (id: string) => { setSelected(id); setStep(0); };
  return <main className="lab-view" id="animation-lab"><div className="lab-intro"><div><span className="section-kicker">ANIMATION LAB · 18 MINI LESSONS</span><h1>让抽象过程动起来。</h1><p>每一步都配着状态变化与一句白话说明。点选知识点，像翻实验记录一样慢慢看。</p></div><span className="lab-orbit">✳</span></div>
    <div className="lab-layout"><nav className="lab-menu" aria-label="动画知识点">{demos.map((item,i)=><button key={item.id} className={item.id===selected?'active':''} onClick={()=>selectDemo(item.id)}><span>{String(i+1).padStart(2,'0')}</span><b>{item.title.split('：')[0]}</b><small>{item.subject.split(' · ')[0]}</small></button>)}</nav>
      <section className="lab-card"><div className="lab-card-head"><div><span>{demo.subject}</span><h2>{demo.title}</h2><p>{demo.intro}</p></div><span className="lab-step-badge">{String(stage+1).padStart(2,'0')} <i>/</i> {String(demo.steps.length).padStart(2,'0')}</span></div>
        <div className={`demo-stage kind-${demo.kind}`}><Scene demo={demo} step={stage}/></div>
        <div className="step-explainer"><span className="step-number">{String(stage+1).padStart(2,'0')}</span><div><span>这一刻发生了什么</span><h3>{demo.steps[stage].title}</h3><p>{demo.steps[stage].text}</p></div></div>
        <div className="lab-progress"><span style={{ width: `${((stage+1)/demo.steps.length)*100}%` }}/></div><div className="lab-controls"><button onClick={()=>setStep(0)} className="reset-demo">↺ <span>从头看</span></button><div><button onClick={()=>setStep(Math.max(0,step-1))} disabled={step===0}>← 上一步</button><button className="next-demo" onClick={()=>setStep((s)=>Math.min(demo.steps.length-1,s+1))} disabled={step>=demo.steps.length-1}>下一步 <span>→</span></button></div></div>
        <div className="lab-keynote"><b>记住这个判断</b><p>{demo.steps[demo.steps.length-1].text}</p></div>
      </section></div>
    <footer className="page-footer"><span>演示用于帮助理解概念</span><span>题目条件与具体数值以原题及教材为准</span></footer>
  </main>;
}
