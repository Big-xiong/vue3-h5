/* eslint-disable import/prefer-default-export */
import Vant, {
    Toast, Notify, Locale, Lazyload,
} from 'vant';
import EN from '/public/language/vant/en';
// import Grid from 'vant';
// import GridItem from 'vant';
// import PasswordInput from 'vant';
// import NumberKeyboard from 'vant';

export function mountVant(app, subConfig) {
    app.use(Vant);
    app.use(Lazyload);
    // app.use(Toast);
    // app.use(Lazyload);
    // app.use(Notify);
    // app.use(Button);
    // app.use(Icon);
    // app.use(Dialog);
    // app.use(Swipe);
    // app.use(SwipeItem);
    // app.use(Empty);
    // app.use(Image);
    // app.use(NavBar);
    // app.use(Switch);
    // app.use(Popup);
    // app.use(Tabbar);
    // app.use(TabbarItem);
    // app.use(Tabs);
    // app.use(PasswordInput);
    // app.use(NumberKeyboard);
    // app.use(Tab);
    // app.use(Form);
    // app.use(Grid);
    // app.use(GridItem);
    // app.use(Field);
    // app.use(List);
    // app.use(Row);

    Toast.setDefaultOptions('success', {
        duration: 3000,
        className: 'success toast-wrap',
        icon: 'none',
    });

    Toast.setDefaultOptions('fail', {
        duration: 3000,
        className: 'fail toast-wrap',
        icon: 'none',
    });

    Toast.setDefaultOptions('loading', {
        overlay: false,
    });

    Notify.setDefaultOptions({
        duration: 0,
        className: 'global-notify-wrap',
    });

    Locale.add({
        en: EN,
        // 'zh-CN': ZH,
        // th: TH,
        // vi: VI,
    });

    Locale.use(subConfig.isI18n ? 'en' : 'zh-CN');
}
