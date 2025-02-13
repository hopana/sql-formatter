const attachFormat = () => {
  const input = document.getElementById('input');
  const output = document.getElementById('output');
  const resultDiv = document.getElementById('resultDiv');
  const highlighted = document.getElementById('sql-highlighted');
  const error = document.getElementById('error');

  const language = document.getElementById('language');
  const tabWidth = document.getElementById('tabWidth');
  const useTabs = document.getElementById('useTabs');
  const keywordCase = document.getElementById('keywordCase');
  const dataTypeCase = document.getElementById('dataTypeCase');
  const functionCase = document.getElementById('functionCase');
  const identifierCase = document.getElementById('identifierCase');
  const indentStyle = document.getElementById('indentStyle');
  const logicalOperatorNewline = document.getElementById('logicalOperatorNewline');
  const expressionWidth = document.getElementById('expressionWidth');
  const lineBetweenQueries = document.getElementById('lineBetweenQueries');
  const denseOperators = document.getElementById('denseOperators');
  const newlineBeforeSemicolon = document.getElementById('newlineBeforeSemicolon');

  function showOutput(text) {
    output.value = text;
    highlighted.textContent = text; // 注意：这里不用 innerText，因为 innerText 会把 HTML 标签转义，不会换行
    // output.style.display = 'block';

    window.Prism = window.Prism || {};
    window.Prism.manual = true;
    if (highlighted) {
      Prism.highlightElement(highlighted);
    }

    resultDiv.style.display = 'block';
    error.style.display = 'none';
  }

  function showError(text) {
    error.innerHTML = text;
    //output.style.display = 'none';
    resultDiv.style.display = 'none';
    error.style.display = 'block';
  }

  function format() {
    try {
      const config = {
        language: language.options[language.selectedIndex].value,
        tabWidth: tabWidth.value,
        useTabs: useTabs.checked,
        keywordCase: keywordCase.options[keywordCase.selectedIndex].value,
        dataTypeCase: dataTypeCase.options[dataTypeCase.selectedIndex].value,
        functionCase: functionCase.options[functionCase.selectedIndex].value,
        identifierCase: identifierCase.options[identifierCase.selectedIndex].value,
        indentStyle: indentStyle.options[indentStyle.selectedIndex].value,
        logicalOperatorNewline:
          logicalOperatorNewline.options[logicalOperatorNewline.selectedIndex].value,
        expressionWidth: expressionWidth.value,
        lineBetweenQueries: lineBetweenQueries.value,
        denseOperators: denseOperators.checked,
        newlineBeforeSemicolon: newlineBeforeSemicolon.checked,
      };
      showOutput(sqlFormatter.format(input.value, config));
    } catch (e) {
      if (e instanceof sqlFormatter.ConfigError) {
        showError(`<h2>Configuration error</h2><p>${e.message}</p>`);
      } else {
        showError(
          `
<h2>An Unexpected Error Occurred</h2>
<p><strong>${e.message}</strong></p>
<p>
  Please report this at
  <a href="https://github.com/sql-formatter-org/sql-formatter/issues">Github issues page.<a>
</p>
<p>Stack Trace:</p>
<pre>${e.stack.toString()}</pre>
`
        );
      }
    }
  }

  input.addEventListener('input', format);
  [
    language,
    tabWidth,
    useTabs,
    keywordCase,
    dataTypeCase,
    functionCase,
    identifierCase,
    indentStyle,
    logicalOperatorNewline,
    expressionWidth,
    lineBetweenQueries,
    denseOperators,
    newlineBeforeSemicolon,
  ].forEach(option => option.addEventListener('change', format));

  format();
};

// 添加拖拽功能
function initResizer() {
  const resizer = document.getElementById('dragMe');
  const leftSide = resizer.previousElementSibling;
  const rightSide = resizer.nextElementSibling;

  // 鼠标按下事件处理
  const mouseDownHandler = function (e) {
    document.body.style.cursor = 'col-resize';
    resizer.classList.add('dragging');

    // 添加禁用文本选择的样式
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    // 获取鼠标按下时的位置
    const startX = e.clientX;
    const leftWidth = leftSide.getBoundingClientRect().width;
    const containerWidth = resizer.parentNode.getBoundingClientRect().width - 6; // 减去resizer宽度

    const inputArea = document.getElementById('input');
    const outputPre = document.getElementById('resultPre');

    // 鼠标移动事件处理
    const mouseMoveHandler = function (e) {
      // 计算移动距离
      const dx = e.clientX - startX;

      // 计算新的左侧宽度（保持在合理范围内）
      const newLeftWidth = Math.max(200, Math.min(leftWidth + dx, containerWidth - 200));
      const leftPercent = (newLeftWidth / containerWidth) * 100;
      const rightPercent = 100 - leftPercent;

      // 设置新的宽度
      leftSide.style.width = `${leftPercent}%`;
      rightSide.style.width = `${rightPercent}%`;

      // 确保flex属性保持为1
      leftSide.style.flex = '0 1 auto';
      rightSide.style.flex = '0 1 auto';

      inputArea.style.overflow = 'hidden';
      outputPre.style.overflow = 'hidden';
    };

    // 鼠标松开事件处理
    const mouseUpHandler = function () {
      document.body.style.cursor = '';
      resizer.classList.remove('dragging');

      // 移除禁用文本选择的样式
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.msUserSelect = '';
      document.body.style.overflow = 'auto';

      inputArea.style.overflow = 'auto';
      outputPre.style.overflow = 'auto';

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    // 添加事件监听
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  };

  // 为分隔条添加鼠标按下事件监听
  resizer.addEventListener('mousedown', mouseDownHandler);
}

document.addEventListener('DOMContentLoaded', attachFormat);
// 在页面加载完成后初始化拖拽功能
document.addEventListener('DOMContentLoaded', initResizer);
