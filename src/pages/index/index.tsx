import { View, Text } from "@tarojs/components";
import { useShareAppMessage } from "@tarojs/taro";

// page.js
export default function Index() {
  useShareAppMessage((res) => {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: "自定义转发标题",
      path: "/page/user?id=123",
    };
  });
  return (
    <View className="me">
      <Text>Hello world!</Text>
    </View>
  );
}
