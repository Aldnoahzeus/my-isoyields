# My IsoYields 数据库

仿照 https://isoyields2.web.cern.ch/ 构建的同位素产额查询系统。

## 📂 文件结构
- `index.html` - 主页面
- `js/app.js` - 逻辑控制
- `data.json` - 数据文件（由脚本生成）
- `data/data.csv` - 你的原始数据
- `tools/csv_to_json.py` - 转换脚本

## 🚀 使用步骤

1. 将你的数据保存为 `data/data.csv`（必须包含列：projectile,target,energy,product,Z,A,yield,yield_unit）
2. 运行转换脚本：
   ```bash
   python tools/csv_to_json.py