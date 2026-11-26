import type { Question } from './types';

const labTitles: Record<string, string> = {
  dijkstra: 'Dijkstra 最短路', topological: '拓扑排序', critical: '关键路径', insertion: '插入排序', heap: '大根堆',
  lru: 'LRU 页面置换', clock: 'CLOCK 页面置换', process: '进程状态', cpu: 'CPU 数据通路', tcp: 'TCP 三次握手',
  'tcp-close': 'TCP 连接释放', gbn: 'GBN 回退重传', sr: 'SR 选择重传', csma: 'CSMA/CA 时序', dns: 'DNS 解析',
  pv: 'PV 有界缓冲区', routing: '路由表与最长前缀匹配', interrupt: '中断响应过程',
};

export function relatedLab(question: Question) {
  const family = question.family.toLowerCase();
  const summary = question.summary.toLowerCase();
  let id: string | undefined;
  if (family === 'routing') id = 'routing';
  else if (family === 'dijkstra') id = 'dijkstra';
  else if (family === 'critical') id = 'critical';
  else if (family === 'topological') id = 'topological';
  else if (family === 'heap') id = 'heap';
  else if (family === 'sorting' || family === 'quicksort') id = 'insertion';
  else if (family === 'page') id = summary.includes('clock') ? 'clock' : 'lru';
  else if (family === 'csma') id = 'csma';
  else if (family === 'tcp') id = /释放|挥手|关闭/.test(question.summary) ? 'tcp-close' : 'tcp';
  else if (family === 'window') id = /\bsr\b|选择重传/i.test(question.summary) ? 'sr' : 'gbn';
  else if (family === 'datapath' || family === 'pipeline') id = 'cpu';
  else if (family === 'dns') id = 'dns';
  else if (family === 'sync') id = 'pv';
  else if (family === 'interrupt') id = 'interrupt';
  else if (family === 'os_general' && /进程/.test(question.summary)) id = 'process';
  return id ? { id, title: labTitles[id] } : null;
}
