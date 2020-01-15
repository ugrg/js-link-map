/*
 * Author: ugrg
 * Create Time: 2020/1/14 18:47
 */
const myChart = window.echarts.init(document.querySelector("#canvas"));
myChart.showLoading();
window.addEventListener("resize", () => myChart.resize());
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
        data: res.data,
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
          width: 0.5,
          curveness: 0.1,
          opacity: 0.7
        }
      }
    ]
  }, true);
});
