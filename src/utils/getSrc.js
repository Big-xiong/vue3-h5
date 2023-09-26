import { reactive } from 'vue';

const ImageMap = reactive({});
const allImages = import.meta.glob(`/src/assets/{images,dark}/**/*.{png,jpg,svg,gif,webp}`);
const currentImages = import.meta.glob(`/src/current_project/assets/**/*.{png,jpg,svg,gif,webp}`);

const findSrc = (path, defaultPath) => {
  if (!defaultPath.includes('/')) {
    let [start, end] = path?.split('.') ?? [];
    start = start?.split('/') ?? [];
    start.pop();
    defaultPath = `${start.join('/')}/${defaultPath}.${end}`;
  } else if (path.includes('/dark/')) {
    defaultPath = defaultPath.replace('/images/', '/dark/');
  }
  if (path.includes('/current_project')) {
    defaultPath = defaultPath.replace('/assets/', '/current_project/assets/');
    // return currentImages[path] ?? currentImages[defaultPath];
  }
  // console.log('~~~~~~~~~~~ path', path);
  const targetPath = allImages[path] ? path : defaultPath;
  const curTargetPath = currentImages[path] ? path : defaultPath;

  if (allImages[targetPath]) {
    if (!ImageMap[targetPath]) {
      ImageMap[targetPath] = '';
      allImages[targetPath]()
        .then((result) => {
          ImageMap[targetPath] = result.default;
        });
    }
  } else if (currentImages[curTargetPath]) {
    if (!ImageMap[curTargetPath]) {
      ImageMap[curTargetPath] = '';
      currentImages[curTargetPath]()
        .then((result) => {
          ImageMap[curTargetPath] = result.default;
        });

      // ImageMap[curTargetPath] = currentImages[curTargetPath].default;
    }
  } else {
    return null;
  }

  return ImageMap[path] || ImageMap[defaultPath];
};

export const $getSrc = ($store, path, defaultPath = '') => {
  const { darkTheme } = $store.state.app;
  if (darkTheme === 'dark') {
    const target = findSrc(path.replace('/images/', '/dark/'), defaultPath);
    if (target !== null) return target;
  }

  if (currentImages[`${path.replace('src', 'src/current_project')}`]) {
    const target = findSrc(path.replace('/assets/', '/current_project/assets/'), defaultPath);
    if (target !== null) return target;
  }
  return findSrc(path, defaultPath);
};
