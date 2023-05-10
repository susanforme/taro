// 'use strict';

// if (!document.elementsFromPoint) {
//   document.elementsFromPoint = elementsFromPoint;
// }
// function elementsFromPoint(x: number, y: number) {
//   const parents: any[] = [];
//   let parent: any = null;
//   do {
//     const element = document.elementFromPoint(x, y);
//     if (element && parent !== element) {
//       parent = element;
//       parents.push(parent);
//       parent.style.pointerEvents = 'none';
//     } else {
//       parent = null;
//     }
//   } while (parent);
//   parents.forEach(function (parent) {
//     return (parent.style.pointerEvents = 'all');
//   });
//   return parents;
// }
