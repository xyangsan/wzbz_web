const typeList = {
  default: "white",
  primary: "#409eff",
  success: "#67c23a",
  info: "#909399",
  warning: "#e6a23c",
  error: "#f56c6c",
  main: '#b8914a'
};

// 在页面的根组件中创建一个容器，用于显示 Toast 弹窗
const toastContainer = document.createElement("div");
toastContainer.setAttribute("id", "toast-container");
document.body.appendChild(toastContainer);

const WzToast = ({ message = "", type = "default", duration = 1400 }) => {
  // 检查是否已经有一个弹窗在显示
  const existingToast = document.querySelector("#toast-container .toast");

  if (existingToast) {
    // 如果已经有一个弹窗在显示，更新它的内容
    existingToast.innerText = message;
  } else {
    // 如果没有弹窗在显示，创建一个新的弹窗
    const toast = document.createElement("div");
    const bgColor = typeList[type];
    const color = type == "default" ? "black" : "white";
    toast.classList.add("toast");
    toast.setAttribute(
      "style",
      `
        position: fixed;
        top: 1rem;
        left: 0;
        right: 0;
        display: inline-block;
        box-sizing: border-box;
        max-width: 6rem;
        margin: 0 auto;
        padding: 0.2rem 0.4rem;
        font-size: 0.32rem;
        font-weight: bold;
        color: ${color};
        text-align: center;
        border: 0.02rem solid ${bgColor == "white" ? typeList["info"] : "transparent"
      };
        border-radius: 0.5rem;
        background-color: ${bgColor};
        z-index: 999;
        animation: toastAnimation 1s cubic-bezier(0.2,0.7,0.6,0.8);
      `
    );
    toast.innerText = message;
    toastContainer.appendChild(toast);
    // 一定时间后移除弹窗
    setTimeout(() => {
      toastContainer.removeChild(toast);
    }, duration);
  }
};

export default WzToast;

