/*
 * @Author: zhicheng ran
 * @Date: 2023-04-27 16:29:34
 * @LastEditTime: 2023-04-27 16:29:35
 * @FilePath: \myApp\src\pages\me\index.tsx
 * @Description:
 */
import { Component, PropsWithChildren } from "react";
import { View, Text } from "@tarojs/components";
import "./index.less";

export default class Me extends Component<PropsWithChildren> {
  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  render() {
    return (
      <View className="me">
        <Text>Hello world!</Text>
      </View>
    );
  }
}
