import { View, Text } from "@tarojs/components";
import Footer from "@/components/Footer";

const Index: React.FC<AppProps> = () => {
  return (
    <View className="index">
      <Text>Index</Text>
      <Footer />
    </View>
  );
};

interface AppProps {}
export default Index;
Index.displayName = "Index";
