---
title: React表单实现的原理
date: 2022-02-27 01:17:32
permalink: /front-end/react/react-form
categories:
  - 前端
  - React
tags:
  -
---
# 函数组件实现
```ts
import React, { ReactElement } from 'react';

type ValueType = string | number;

type ReactChildType = {
  type: {
    displayName: string;
  };
} & ReactElement;

interface FormStateType {
  formData: Record<string, string>;
}

interface FormItemType {
  name: string;
  label: string;
  value?: ValueType;
  handleChange?: (name: string, value: ValueType) => void;
  children?: ReactChildType;
}

interface InputType {
  value?: ValueType;
  onChange?: (value: ValueType) => void;
}

export const FormItem: React.FC<FormItemType> = (props) => {
  const { children, name, handleChange, value, label } = props;
  const onChange = (value: string | number) => {
    /* 通知上一次value 已经改变 */
    handleChange && handleChange(name, value);
  };

  return (
    <div className="form">
      <span className="label">{label}:</span>
      {React.isValidElement(children) && children.type.displayName === 'input'
        ? React.cloneElement(children, { onChange, value })
        : null}
    </div>
  );
};
FormItem.displayName = 'formItem';

/* Input 组件, 负责回传value值 */
export const Input = ({ onChange, value }: InputType) => {
  return (
    <input
      className="input"
      onChange={(e) => onChange && onChange(e.target.value)}
      value={value}
    />
  );
};
/* 给Component 增加标签 */
Input.displayName = 'input';

class Form extends React.Component {
  state = {
    formData: {},
  } as FormStateType;

  static displayName = '';
  /* 用于提交表单数据 */
  submitForm = (cb: Function) => {
    cb({ ...this.state.formData });
  };
  /* 获取重置表单数据 */
  resetForm = () => {
    const { formData } = this.state;
    Object.keys(formData).forEach((item) => {
      formData[item] = '';
    });
    this.setState({
      formData,
    });
  };
  /* 设置表单数据层 */
  setValue = (name: string, value: ValueType) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value,
      },
    });
  };

  render() {
    const { children } = this.props;
    const renderChildren = React.Children.map(
      children as ReactChildType[],
      (child: ReactChildType) => {
        if (child && child.type.displayName === 'formItem') {
          const { name } = child.props;
          /* 克隆`FormItem`节点，混入改变表单单元项的方法 */
          const Children = React.cloneElement(
            child,
            {
              key: name /* 加入key 提升渲染效果 */,
              handleChange: this.setValue /* 用于改变 value */,
              value: this.state.formData[name] || '' /* value 值 */,
            },
            child.props.children,
          );
          return Children;
        }
      },
    );
    return <>{renderChildren}</>;
  }
}

/* 增加组件类型type  */
Form.displayName = 'form';

export default Form;
```