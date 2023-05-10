/*
 * @Author: zhicheng ran
 * @Date: 2023-04-28 13:40:58
 * @LastEditTime: 2023-04-28 13:40:58
 * @FilePath: \myApp\src\components\Footer\index.tsx
 * @Description:
 */
import { Button, View } from '@tarojs/components';
import { redirectTo } from '@tarojs/taro';
import './index.less';

const Footer: React.FC<AppProps> = () => {
  return (
    <View className="footer">
      {['/pages/index/index', '/pages/me/index'].map(
        (v) => {
          return (
            <Button
              key={v}
              onClick={() => {
                redirectTo({
                  url: v,
                });
              }}>
              {v}
            </Button>
          );
        },
      )}
    </View>
  );
};

interface AppProps {}
export default Footer;
Footer.displayName = 'Footer';
