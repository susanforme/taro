import { View, Text } from "@tarojs/components";

const Index: React.FC<AppProps> = () => {
  return (
    <View className="index">
      <Text>Index</Text>
    </View>
  );
};

interface AppProps {}
export default Index;
Index.displayName = "Index";
