import agentProtocolCN from '/src/assets/data/protocol/agentCN.txt?raw';
import agentProtocolEN from '/src/assets/data/protocol/agentEN.txt?raw';
import agentProtocolTH from '/src/assets/data/protocol/agentTH.txt?raw';
import agentProtocolVI from '/src/assets/data/protocol/agentVI.txt?raw';
import memberProtocolCN from '/src/assets/data/protocol/memberCN.txt?raw';
import memberProtocolEN from '/src/assets/data/protocol/memberEN.txt?raw';
import memberProtocolTH from '/src/assets/data/protocol/memberTH.txt?raw';
import memberProtocolVI from '/src/assets/data/protocol/memberVI.txt?raw';
import { i18n } from '@/init';

// 代理注册条款
export async function getProtocol() {
  switch (i18n.global.locale) {
    case 'zh-CN':
      return Promise.resolve(agentProtocolCN);
    case 'en':
      return Promise.resolve(agentProtocolEN);
    case 'th':
      return Promise.resolve(agentProtocolTH);
    case 'vi':
      return Promise.resolve(agentProtocolVI);
  }
}

// 会员注册条款
export async function getMemberProtocol() {
  switch (i18n.global.locale) {
    case 'zh-CN':
      return Promise.resolve(memberProtocolCN);
    case 'en':
      return Promise.resolve(memberProtocolEN);
    case 'th':
      return Promise.resolve(memberProtocolTH);
    case 'vi':
      return Promise.resolve(memberProtocolVI);
  }
}

