<script lang="jsx">
import {
  defineComponent, reactive, ref, watch, h, watchEffect, renderSlot, Teleport,
} from 'vue';
import { Toast } from 'vant';
import { isFunction } from '@/utils';

function renderTargetSlots(slots, target) {
  if (slots && target) {
    if (isFunction(target)) {
      return target();
    }
    if (slots[target]) {
      return slots[target]();
    }
    return null;
  }
  return null;
}

const Component = ({
  data,
  value,
  type,
  width,
  prop,
  slot,
  optionLabel,
  renderOption,
  popupModels,
  ...args
}, ctx) => {
  const config = {
    style: { width },
    ...args,
  };

  function handleConfirm(event) {
    if (type === 'picker') {
      const target = args?.list?.find((item) => item.label === event);
      data[prop] = target?.value || null;
    }
    popupModels[`${prop}PopUpVisible`] = false;
    args?.popupChange?.();
    args?.onConfirm?.();
  }

  function handleCancel() {
    popupModels[`${prop}PopUpVisible`] = false;
    args?.onCancel?.();
  }

  switch (type) {
    case 'password-input':
      return <van-password-input v-model={data[prop]} {...config} />;
    case 'datetime-picker':
      if (!data[prop]) data[prop] = new Date();
      return <van-datetime-picker onConfirm={(event) => handleConfirm(event)} onCancel={handleCancel}
        v-model={data[prop]} type={args.subType ?? null} {...config} />;
    case 'cascader':
      return <van-cascader v-model={data[prop]} options={args.list} {...config} />;
    case 'picker':
      return (
        <van-picker onConfirm={handleConfirm} onCancel={handleCancel}
          default-index={args.list.findIndex((item) => item.value === data[prop])}
          {...config} columns={args?.list?.map((option) => (option.label))} />
      );
    default:
  }
};

export default defineComponent({
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    border: {
      type: Boolean,
      default: true,
    },
    borderBottom: {
      type: Boolean,
      default: false,
    },
    marginBottom: {
      type: Boolean,
      default: true,
    },
    inputPadding: {
      type: Boolean,
      default: false,
    },
    inputAlign: {
      type: String,
      default: '',
    },
    padding: {
      type: Boolean,
      default: true,
    },
  },

  emit: ['onChange', 'onPopup'],

  setup(props, ctx) {
    // 拍平成一维数组进行逻辑处理
    const columns = [...props.columns];
    // 声明form组件实例
    const form = ref(null);
    // 根据columns prop动态生成响应式数据供双绑使用
    const data = reactive(
      // 目前只用到2层
      columns.flat(2)
        .filter((item) => item.prop)
        .reduce((curr, next) => {
          if (next.pair) {
            next.prop.map((prop, index) => curr[prop] = next.defaultValue?.[index] ?? '');
          } else {
            // console.log(next.prop, next.defaultValue)
            if (next.type === 'datetime-picker') {
              curr[next.prop] = next.defaultValue ? new Date(next.defaultValue) : new Date();
            } else {
              curr[next.prop] = next.defaultValue || '';
            }
          }
          return curr;
        }, {}),
    );

    const fields = ref({});
    const focus = ref({});

    const popupModels = reactive(
      columns.flat(2)
        .filter((item) => item.prop)
        .reduce((curr, next) => {
          if (next.type === 'picker' && next.list.length) {
            fields.value[next.prop] = next.list.find((item) => item.value === next.defaultValue)?.label || '';
          } else {
            fields.value[next.prop] = next.defaultValue || '';
          }

          if (next.pair) {
            next.prop.map((key) => curr[`${key}PopUpVisible`] = false);
          } else {
            curr[`${next.prop}PopUpVisible`] = false;
          }
          return curr;
        }, {}),
    );

    // 目前只用到2层
    // 提供placeholder = label的初始值设定功能
    columns.forEach((item) => {
      if (['label'].includes(item.placeholder)) item.placeholder = item.label;
    });

    // 动态获取每行的rules配置
    const rules = columns.flat(2)
      .filter((item) => item.rule)
      .reduce((curr, next) => {
        next.rule.forEach((child) => {
          // 提供placeholder = label | placeholder的初始值设定功能
          if (['label', 'placeholder'].includes(next.placeholder)) child.message = next[child.placeholder];
        });
        curr[next.prop] = next.rule || [];
        return curr;
      }, {});

    // 刷新组件的key，Select场景使用比较多
    const updateKey = ref(0);

    // 当data数据变动时，抛出onChange事件
    watch(data, () => {
      Object.keys(data).map((key) => {
        /* console.log(key); */
        props.columns.forEach((item) => {
          if (Array.isArray(item.list) && item.prop === key && item.type === 'picker') {
            const label = item.list.find((subItem) => subItem.value === data[key])?.label;
            if (label) {
              fields.value[item.prop] = item.format ? item.format(label) : label;
            }
            /* data[item.prop] = item.defaultValue; */
          }
        });
      });
      ctx.emit('onChange', data);
    });

    watch(popupModels, () => {
      ctx.emit('onPopup', popupModels);
    });

    // 当传入的prop columns变动时，更新刷新组件的key

    watch(() => props, (newVal, oldVal) => {
      props.columns.forEach((item, index) => {
        if (data[item.prop]) {
          return;
        }

        if (Array.isArray(item.list) && typeof item.defaultValue !== 'undefined') {
          const label = item.list.find((subItem, subIndex) => subItem.value === item.defaultValue)?.label;
          fields.value[item.prop] = item.format ? item.format(label) : label;
          data[item.prop] = item.defaultValue;
        } else if (item.defaultValue) {
          data[item.prop] = item.defaultValue;
        }
      });
      updateKey.value += 1;
    }, { deep: true });

    // Vue3抛出组件内容供外部使用
    ctx.expose({
      data,
      form,
      popupModels,
    });

    function renderDefaultSlots(formItem, index) {
      const {
        block,
        pair,
        label,
        prop,
        placeholder,
        ...args
      } = formItem;
      const _button = () => {
        // 密码输入框增加小眼睛
        if (prop === 'password' && args.eyeClickHandle) {
          return () => <span className={args.type === 'password' ? 'password-eye eye-open' : 'password-eye eye-close'} onClick={args.eyeClickHandle}> </span>;
        }
        return renderTargetSlots(ctx.slots, args.buttonSlot);
      };
      if (!pair) {
        return {
          label: block ? ctx.slots?.[args.labelSlot]?.() : <span>{label}</span>,
          'left-icon': renderTargetSlots(ctx.slots, args.leftIconSlot),
          'right-icon': renderTargetSlots(ctx.slots, args.rightIconSlot),
          button: _button(),
          extra: renderTargetSlots(ctx.slots, args.extraSlot),
        };
      }
    }

    function renderBasicInput(formItem, index) {
      const {
        type,
        block,
        label,
        prop,
        position,
        pair,
        readonly,
        ...args
      } = formItem;
      return <>
        <van-field area={type === 'textarea'} type={type} key={updateKey.value} v-model={data[prop]} name={prop}
          onFocus={() => {
            focus.value[prop] = true;
          }}
          onBlur={() => focus.value[prop] = false}
          class={focus.value[prop] && !focus.value[readonly] ? 'focused' : 'un-focus'}
          block={block}
          label={block ? '' : label} {...args} rules={rules[prop]}>
          {renderDefaultSlots(formItem, index)}
        </van-field>
      </>;
    }

    function renderPopupItem(formItem, index) {
      const {
        type,
        block,
        label,
        prop,
        position,
        pair,
        disabled,
        ...args
      } = formItem;

      function popupChange() {
        if (args?.format) {
          fields.value[prop] = args.format(data[prop]);
        } else if (type === 'picker') {
          fields.value[prop] = args.list.find((item) => item.value === data[prop])?.label ?? '';
        } else {
          fields.value[prop] = data[prop];
        }
      }

      if (args.defaultValue && !fields.value[prop]) {
        popupChange();
      }

      // if (import.meta.env.SSR) return null;

      return <>
        <van-field disabled={disabled} v-model={fields.value[prop]} readonly clickable name={prop} onClick={() => {
          if (disabled) {
            args.disabledMessage && Toast.fail(args.disabledMessage);
          } else {
            popupModels[`${prop}PopUpVisible`] = !args?.readonly;
          }
        }} rules={rules[prop]} key={`${index}
  } `} label={block ? '' : label} block={block} {...args} >
          {renderDefaultSlots(formItem, index)}
        </van-field>
        {
          type === 'calendar'
            ? <van-calendar v-model={[popupModels[`${prop}PopUpVisible`], 'show']}
              onConfirm={(date) => data[prop] = date} />
            : <van-popup teleport="body" round v-model={[popupModels[`${prop}PopUpVisible`], 'show']}
              position={position || 'bottom'}>
              {ctx.slots?.[args.slot]?.()
                || <Component {...args} type={type} popupChange={popupChange} data={data} prop={prop}
                  popupModels={popupModels} />}
            </van-popup>
        }
      </>;
    }

    function renderFormComponent(formItem, index) {
      const {
        type,
        block,
        label,
        prop,
        pair,
        position,
        ...args
      } = formItem;

      if (pair) {
        return <van-field class="pair-field" rules={rules[prop]} name={prop} block={block} type={type} {...args} >
          {{
            label: () => (ctx.slots?.[args.labelSlot]?.() || (block ? '' : <span>{label}</span>)),
            'left-icon': renderTargetSlots(ctx.slots, args.leftIconSlot),
            'right-icon': renderTargetSlots(ctx.slots, args.rightIconSlot),
            button: renderTargetSlots(ctx.slots, args.buttonSlot),
            input: () => {
              if (['input', 'password', 'number', 'textarea'].includes(formItem.type)) {
                return <div class="pair-group">
                  {renderBasicInput({
                    ...formItem,
                    leftIcon: '',
                    label: '',
                    prop: prop[0],
                    placeholder: args.placeholder[0],
                  }, index)}
                  <span class="separator">-</span>
                  {renderBasicInput({
                    ...formItem,
                    leftIcon: '',
                    label: '',
                    prop: prop[1],
                    placeholder: args.placeholder[1],
                  }, index)}
                </div>;
              }

              if (['calendar', 'picker', 'datetime-picker', 'password-input'].includes(type)) {
                return <div class="pair-group">
                  {renderPopupItem({
                    ...formItem,
                    label: '',
                    leftIcon: '',
                    prop: prop[0],
                    placeholder: args.placeholder[0],
                  }, index)}
                  <span class="separator">-</span>
                  {renderPopupItem({
                    ...formItem,
                    label: '',
                    leftIcon: '',
                    prop: prop[1],
                    placeholder: args.placeholder[1],
                  }, index)}
                </div>;
              }
            },
          }}
        </van-field>;
      }

      if (['input', 'password', 'number', 'textarea'].includes(formItem.type)) {
        return renderBasicInput(formItem, index);
      }

      if (['calendar', 'picker', 'datetime-picker', 'password-input'].includes(type)) {
        return renderPopupItem(formItem, index);
      }

      return <van-field rules={rules[prop]} name={prop} block={block} type={type} {...args} >
        {renderDefaultSlots(formItem)}
      </van-field>;
    }

    function renderFromItem(formItem, index) {
      const {
        block,
        label,
        slot,
      } = formItem;

      if (Array.isArray(formItem)) {
        return (
          <div className="config-form-wrap-group">
            {formItem.map((subFormItem, subIndex) => renderFromItem(subFormItem, subIndex))}
          </div>
        );
      }

      return <>
        {block && <div class="block-label">
          {formItem.required && <span className="required"></span>}{ctx.slots?.[formItem.blockSlot]?.() ?? label}
        </div>}
        {renderFormComponent(formItem, index)}
        {ctx.slots?.[slot]?.()}
      </>;
    }

    return () => (
      <van-form class={{
        'config-form-wrap': true,
        'config-form-wrap-focus-border': typeof props.focusBorder === 'boolean' ? props.focusBorder : true,
        'config-form-wrap-no-padding': !props.padding,
        'config-form-wrap-no-margin-bottom': !props.marginBottom,
        'config-form-wrap-no-border': !props.border,
        'config-form-wrap-input-padding': props.inputPadding,
        'config-form-wrap-border-bottom': props.borderBottom,
        'config-form-wrap-align-right': props.inputAlign === 'right',
      }} ref={form} {...ctx.attrs} key={updateKey.value}>
        {props.columns.map((item, index) => renderFromItem(item, index))}
      </van-form>
    );
  },
});
</script>

<style lang="less" scoped>
.config-form-wrap {
  :deep(input) {
    font-size: 28px;
  }

  .block-label {
    padding-bottom: 20px;
    font-size: 28px;
    display: flex;
    align-items: center;
    color: var(--dark-fff, var(--font-color-222930));

    .required {
      color: var(--dark-fff, var(--font-color-ff000b));
      font-size: 50px;
      line-height: 25px;
      display: flex;
      align-items: center;

      &::after {
        display: inline;
        margin-top: 20px;
        content: "*";
      }
    }
  }

  :deep(.van-field) {
    align-items: center;
    min-height: 100px;

    .van-field__right-icon {
      padding-right: 0;
      color: var(--dark-fff, var(--font-color-222930));
      margin-right: 0;

      .van-icon {
        margin-right: 0;
        margin-left: 0;
      }
    }

    .van-field__left-icon {
      color: var(--theme-color);
    }

    .van-icon {
      font-size: 35px;
      margin-right: 10px;
    }

    input {
      color: var(--dark-fff, var(--font-color-222930));

      &::placeholder {
        color: var(--dark-999, var(--font-color-fff-4)) !important;
      }
    }

    .van-field__button {
      display: flex;
    }
  }

  &-input-padding {
    :deep(input) {
      padding-left: 30px;
    }
  }

  &-no-padding {
    .van-field {
      padding: 0 !important;
    }
  }

  &-align-right {
    :deep(.van-cell__value) {
      justify-content: flex-end;
    }
  }

  &-focus-border {
    :deep(.van-cell) {
      &.focused {
        --cur-color-fff-1: var(--theme-color);
        border-color: var(--theme-color) !important;
      }
    }
  }

  &-no-border {
    .van-field {
      border: none !important;
      border-radius: 0;
    }
  }

  &-border-bottom {
    .van-field {
      border-radius: 0;
      border-bottom: solid 2px var(--dark-333, var(--border-color-e7e7e7));
    }
  }

  &-no-margin-bottom {
    .van-field {
      margin-bottom: 0 !important;
    }
  }

  :deep(.van-field__label) {
    color: var(--dark-fff);

    span {
      white-space: nowrap;
      font-size: 28px;
    }
  }

  :deep([block="true"]) {
    /* padding: 0 !important; */
    position: relative;

    .van-field__label {
      width: 0;
      display: flex;
      align-items: center;
      margin-left: 0;
      margin-right: 26px;
    }

    .van-field__value,
    .van-field__body {
      width: 100%;
    }

    .van-field__error-message {
      position: absolute;
      left: 0;
    }
  }

  :deep([area="true"]) {
    height: auto;
    overflow: visible;

    .van-field__word-limit {
      position: absolute;
      right: 0px;
      bottom: 0px;
      font-size: 28px;
    }
  }
}

.pair-field {
  :deep(.van-field) {
    margin-bottom: 0;
    border-bottom: none !important;
    padding: 0 !important;
    height: 100%;

    input {
      text-align: center;
      /* font-size: 30px; */
      color: var(--dark-fff, var(--font-color-222930));
    }
  }

  .separator {
    padding: 5px;
    color: var(--font-color-999999);
  }

  :deep(.van-field__right-icon) {
    display: none;
  }

  :deep(.van-field_button) {
    display: none;
  }

  .pair-group {
    display: flex;
    align-items: center;

    :deep(.van-field) {
      width: 140px;
      display: flex;
      flex-direction: column;
    }

    :deep(.van-field__value) {
      height: 100%;
    }
  }
}

.van-field--disabled {
  background-color: var(--dark-282828, var(--bg-color-dbdbdb)) !important;
}
</style>
