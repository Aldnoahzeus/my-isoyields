# csv_to_json.py
import pandas as pd
import json
import os

# 输入输出路径
csv_file = r'data/data.csv'     # 你的 CSV 数据
json_file = 'data.json'        # 输出 JSON

if not os.path.exists(csv_file):
    print(f"❌ 错误：找不到 {csv_file}")
    print("请将你的数据保存为 data/data.csv")
    exit(1)

try:
    df = pd.read_csv(csv_file)
    # 确保列名正确
    required_cols = ['projectile','target','energy','product','Z','A','yield','yield_unit']
    if not all(col in df.columns for col in required_cols):
        print(f"❌ 列名错误！请确保包含：{required_cols}")
        print(f"当前列名：{list(df.columns)}")
        exit(1)

    # 转换为 JSON
    df.to_json(json_file, orient='records', indent=2)
    print(f"✅ 成功生成 {json_file}")
    print(f"共 {len(df)} 条数据")
except Exception as e:
    print(f"❌ 转换失败：{e}")