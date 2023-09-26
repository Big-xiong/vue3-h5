const INDEX_CONFIG = {
  59001: {
    title: '海外版',
    default: true,
    name: 'esports',
    hasXcoin: true,
    hasTutorailGuide: false,
    project: '海外版59001',
    secName: '',
    domain: '',
  },
};

// const PROJECT_NAME = $appNo;
const PROJECT_NAME = import.meta.env.VITE_APP_PROJECT_NAME;

const CURRENT_INDEX = INDEX_CONFIG[PROJECT_NAME];

export const LANGS = ['en', 'th', 'vi', 'zh-CN'];

export { INDEX_CONFIG, PROJECT_NAME, CURRENT_INDEX };
