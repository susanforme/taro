import { View, Text } from "@tarojs/components";

const Footer : React.FC<FooterProps> = () => {
  return (
    <View className='Footer' >
      <Text>Footer</Text>
    </View>
  );
};

interface FooterProps {}
export default Footer;
Footer.displayName = "Footer";

