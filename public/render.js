/*
 * Author: ugrg
 * Create Time: 2020/1/14 18:47
 */
const myChart = window.echarts.init(document.querySelector("#canvas"));
myChart.showLoading();
fetch("/data").then((res) => res.json()).then(res => {
  myChart.hideLoading();
  myChart.setOption(option = {
    title: {
      text: res.name
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",
        layout: "force",
        // progressiveThreshold: 700,
        data: res.data.map(function (node) {
          return {
            id: node.id,
            name: node.id,
            symbolSize: node.size
          };
        }),
        edges: res.edges,
        emphasis: {
          label: {
            position: "right",
            show: true
          }
        },
        roam: true,
        focusNodeAdjacency: true,
        lineStyle: {
          width: 3,
          curveness: 0.3,
          opacity: 0.7
        }
      }
    ]
  }, true);
});
