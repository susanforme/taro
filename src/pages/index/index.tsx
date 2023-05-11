import { Text, View } from '@tarojs/components';
import { $ } from '@tarojs/extend';
import { useEffect, useMemo, useState } from 'react';
import './index.scss';

const Classify: React.FC<AppProps> = () => {
  const [editing, setEditing] = useState(true);
  const [order, setOrder] = useState<number[]>([]);

  const btnText = useMemo(() => {
    if (editing) {
      return '完成';
    } else {
      return '编辑';
    }
  }, [editing]);
  useEffect(() => {
    new DragAndDropSort('#container', editing, (order) => {
      setOrder(order);
    });
  }, [editing]);
  console.log('order', order);
  return (
    <View className="classify">
      <View className="tip">
        <Text>长按模块拖动排序可调整课程分类展示顺序</Text>
        <View
          className="btn"
          onClick={() => {
            setEditing(!editing);
          }}>
          {btnText}
        </View>
      </View>

      <View id="container">
        {[1, 2, 3, 4, 5, 6].map((v, index) => {
          return (
            <View
              key={v}
              data-index={index}
              className="box">
              创新创业{v}
            </View>
          );
        })}
      </View>
    </View>
  );
};

interface AppProps {}
export default Classify;
Classify.displayName = 'Classify';

/**
 * @description 小程序拖拽排序通用类封装 适用于taro
 * @description  需在配置中配置{enablePullDownRefresh: false,disableScroll: true,}
 * @example new DragAndDropSort('#container',true,(order)=>{console.log(order)})
 * @example <View id="container">
 *         <View
 *            key={v}
 *            data-index={index}
 *            className="box">
 *            创新创业{v}
 *         </View>
 * </View>
 * @susanforme
 */
class DragAndDropSort {
  #startX: number = 0;
  //TODO 可优化 计算出第几个,统一设置为当前item的中奖高度,而不是touch的位置
  #startY: number = 0;
  #offsetX: number = 0;
  #offsetY: number = 0;
  /** 是否正在拖拽 */
  #dragging: boolean = false;
  /** 正在操作的元素 */
  #target: HTMLElement | null = null;
  /** 边界值 */
  #boundary = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };
  /** 容器 */
  #container: any;
  /** 子元素 */
  #children: any[];
  /** 单项子元素高度 */
  #itemHeight = 0;
  /** 排序改变时的回调 */
  #onOrderChange?: (order: number[]) => void;
  constructor(
    /**
     * @description 父元素容器的选择器
     * @example '#container' '.container' 'container'
     */
    selector: string,
    /** 是否开启拖拽排序 */
    open: boolean,
    /** 排序改变时的回调 */
    onOrderChange?: (order: number[]) => void,
  ) {
    // 挂载容器
    this.#container = $(selector)?.[0];
    if (!this.#container) {
      return;
    }
    // 挂载子元素
    this.#children = this.#getChildren();
    this.#onOrderChange = onOrderChange;
    this.#init(open);
  }
  /**
   * @param time 时间
   * @description 睡一哈儿~
   */
  #sleep(time: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  }
  /**
   * @description 初始化
   */
  async #init(open: boolean) {
    const container = $(this.#container);
    try {
      // 开启拖拽 绑定事件
      if (open) {
        // 等待元素渲染完成,进入下一次事件循环
        await this.#sleep(100);
        const res = await container.offset();
        this.#itemHeight = await $(
          this.#children[0],
        ).height();
        this.#boundary = {
          top: res.top,
          bottom: res.top + res.height,
          left: res.left,
          right: res.left + res.width,
        };
        container.on(
          'touchstart',
          this.#handleTouchStart.bind(this),
        );
        container.on(
          'touchmove',
          this.#handleTouchMove.bind(this),
        );
        container.on(
          'touchend',
          this.#handleTouchEnd.bind(this),
        );
      } else {
        // 关闭拖拽 解绑事件
        console.log('解绑事件!');
        ['touchstart', 'touchmove', 'touchend'].forEach(
          (event) => {
            container.off(event);
          },
        );
      }
    } catch (error) {
      // this.#init(open);
      console.log('error->', error);
    }
  }
  /**
   * @description touch开始,taro 小程序端event事件并不携带target,为了兼容性考虑自己获取
   */
  #handleTouchStart(event: any) {
    const touch = event.touches[0];
    this.#startX = touch.clientX;
    this.#startY = touch.clientY;
    // 在元素上必须设置data-index
    this.#target = $(
      `.box[data-index='${event.target?.dataset?.index}']`,
    )?.[0];
  }

  #handleTouchMove(event: TouchEvent) {
    // 阻止冒泡穿透
    event.stopPropagation();
    if (!this.#target) {
      return;
    }
    const touch = event.touches[0];
    // 获取偏移量
    this.#offsetX = touch.clientX - this.#startX;
    this.#offsetY = touch.clientY - this.#startY;
    if (
      !this.#dragging &&
      (Math.abs(this.#offsetX) > 10 ||
        Math.abs(this.#offsetY) > 10)
    ) {
      this.#dragging = true;
    }
    // 当前元素的位置 若大于边界值+ 一个元素的高度 则设置为边界值+一个元素的高度
    if (
      this.#boundary.bottom + this.#itemHeight <
      touch.clientY
    ) {
      this.#offsetY =
        this.#boundary.bottom -
        this.#startY +
        this.#itemHeight;
    }
    // 当前元素的位置 若小于边界值- 一个元素的高度 则设置为边界值-一个元素的高度
    else if (
      this.#boundary.top - this.#itemHeight >
      touch.clientY
    ) {
      this.#offsetY =
        this.#boundary.top -
        this.#startY -
        this.#itemHeight;
    }
    // 若是拖动状态 则设置元素的位置
    if (this.#dragging) {
      // 设置元素的位置 为了防止元素跳动,设置为translate,同时translate有gpu加速,性能更佳
      this.#target!.style.transform = `translate(0px, ${
        this.#offsetY
      }px)`;
      // 给拖动元素添加样式
      this.#target.classList.add('dragging');
      // 给容器添加样式

      this.#container.classList.add('selected');
    }
  }

  #handleTouchEnd(event: any) {
    event.stopPropagation();
    if (!this.#target) {
      return;
    }
    if (this.#dragging) {
      // 拖动结束,清空元素的位置
      this.#target!.style.transform = '';
      this.#target.classList.remove('dragging');
      this.#container.classList.remove('selected');
      this.#dragging = false;
      // 获取停留的位置
      this.#getTargetIndex(
        event.changedTouches[0],
        event.target?.dataset?.index,
      ).then((stayIndex) => {
        const currentIndex = this.#getIndexById(
          event.target?.dataset?.index,
        );
        if (stayIndex !== null) {
          let refChild = null;
          if (stayIndex !== this.#children.length - 1) {
            if (stayIndex < currentIndex) {
              refChild = this.#children[stayIndex];
            } else {
              refChild = this.#children[stayIndex + 1];
            }
          }
          this.#container.insertBefore(
            this.#target!,
            refChild,
          );
          this.#children = this.#getChildren();

          this.#onOrderChange?.(this.#getOrder());
        }
      });
    }
  }
  /**
   * @description 获取当前最新的子元素
   */
  #getChildren() {
    return $(this.#container).children?.();
  }
  /**
   *
   * @param id data-index 所绑定的id
   * @returns 返回根据id查询出的索引
   */
  #getIndexById(id: number) {
    for (
      let index = 0;
      index < this.#children.length;
      index++
    ) {
      if (
        Object.is(this.#children[index].dataset.index, id)
      ) {
        return index;
      }
    }
    return -1;
  }
  /**
   *
   * @param touches  touch事件所传入的touches
   * @param id data-index所绑定的id
   * @returns 根据touch事件所传入的touches获取停留的位置所在元素的索引
   */
  async #getTargetIndex(touches: any, id: number) {
    try {
      //小程序不支持 document.elementFromPoint 傻逼张小龙
      //!! 不支持childNodes 切记,在小程序端会正常,但是在切换到h5端会报错,因为childNodes 会获取到注释节点及文本节点,所以长度等会错误的返回
      const children = this.#children;
      const { pageX, pageY } = touches;
      for (
        let index = 0;
        index < children.length;
        index++
      ) {
        // 排除自己
        if (Object.is(children[index].dataset.index, id)) {
          continue;
        }
        const offset = await $(children[index]).offset();
        const rect = {
          top: offset.top,
          bottom: offset.top + offset.height,
          left: offset.left,
          right: offset.left + offset.width,
        };
        // 判断是否在元素内
        if (
          pageX > rect.left &&
          pageX < rect.right &&
          pageY > rect.top &&
          pageY < rect.bottom
        ) {
          return index;
        }
        // 判断超出边界的情况
        if (pageY < this.#boundary.top) {
          return 0;
        }
        if (pageY > this.#boundary.bottom) {
          return children.length - 1;
        }
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  /**
   * @description 获取当前元素的顺序,以data-index所绑定id为依据
   */
  #getOrder() {
    const children = this.#children;
    const result: any[] = [];
    for (let index = 0; index < children.length; index++) {
      result.push(children?.[index]?.dataset?.index);
    }
    return result;
  }
}
