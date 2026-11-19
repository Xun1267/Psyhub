# RI-CLPM 讲义教学配图
使用内置 ImageGen 生成。以下均为教学示意图，不是原论文图。

## clpm-teaching.png

保存路径：/Users/xun/Desktop/psyhub-local/methods/figures/clpm-teaching.png

```text
Use case: scientific-educational. Asset type: a precise psychology textbook path diagram for a Chinese RI-CLPM lecture website. Create ONE polished landscape diagram, high resolution, white background, restrained slate gray lines, muted lavender and blue accents, generous spacing, crisp legible Chinese and Latin labels, flat vector-like appearance rendered as a bitmap. No photos, decorations, icons, shadows, 3D, watermark.
Title exactly: "传统交叉滞后模型（教学示意）".
Three time columns T1, T2, T3. Two rows of rectangular observed-variable nodes: top row "压力 P1", "压力 P2", "压力 P3"; bottom row "睡眠 S1", "睡眠 S2", "睡眠 S3". Draw exactly these directed paths, single arrowheads pointing toward the later time: P1→P2, P2→P3, S1→S2, S2→S3 as dark slate horizontal lines. Draw P1→S2, P2→S3 in muted lavender, and S1→P2, S2→P3 in muted blue. X crossings must be separated by clear line routing. Three curved double-headed vertical covariance paths P1↔S1, P2↔S2, P3↔S3 in light gray. Do not add numbers or significance stars. At bottom a compact legend: "横向：自回归路径" / "斜向：交叉滞后路径" / "双向：同期关联". Footer exactly: "教学示意；路径表示预测关系，不单独证明因果。". Every required node appears once. No arrows back in time.
```

## riclpm-teaching.png

保存路径：/Users/xun/Desktop/psyhub-local/methods/figures/riclpm-teaching.png

```text
Use case: scientific-educational. Asset type: precise Chinese psychology RI-CLPM teaching path diagram. Create ONE wide landscape diagram on pure white, subtle lavender and slate gray accents, crisp thin strokes, legible Chinese labels and Latin identifiers, plenty of breathing room. Flat vector-like bitmap, no decoration, 3D, shadows, photos, watermark.
Title: "随机截距交叉滞后模型（教学示意）".
A vertical dashed divider separates a narrow left panel "个体间层面" and wider right panel "个体内层面". Left panel: exactly two circles vertically arranged labeled "RI_IC" and "RI_NSSI", connected by a curved double-headed covariance arrow labeled "0.36***". Under it in small but legible text: "数值为讲义中的示例标注". 
Right panel: three columns titled T1, T2, T3. Exactly six circles in two rows: upper "IC1*", "IC2*", "IC3*"; lower "NSSI1*", "NSSI2*", "NSSI3*". The asterisk here means within-person deviation, never a significance star: add one note "* 表示偏离个人稳定水平的波动". Dark horizontal self-regression arrows IC1*→IC2*→IC3* and NSSI1*→NSSI2*→NSSI3*. Two expressly illustrated cross paths: IC1*→NSSI2* as a dashed lavender arrow; NSSI2*→IC3* as a solid lavender arrow. Add the other two forward cross paths NSSI1*→IC2* and IC2*→NSSI3* as thin neutral gray arrows with no statistical annotations. Curved vertical double-headed covariance paths at each time between the two within-person variables. No backward-time arrows. Do NOT connect stable random intercept circles directly to within-person circles: they are separate components. The observed score measurement decomposition paths are deliberately omitted. Footer in legible text: "简化示意：测量分解路径省略；实线和虚线仅对应讲义中的显著性示例，不表示新分析结果。". All Chinese and identifiers spelled exactly. IC means 同一性混乱 and NSSI means 非自杀性自伤, put this in a small legend only.
```

## riclpm-mediation-teaching.png

保存路径：/Users/xun/Desktop/psyhub-local/methods/figures/riclpm-mediation-teaching.png

```text
Use case: scientific-educational. Asset type: precise three-variable RI-CLPM longitudinal mediation teaching diagram for Chinese R lecture. Create ONE wide landscape educational diagram, pure white background, slate gray strokes, muted lavender highlighting, clear Chinese labels and exact Latin identifiers, flat vector-like bitmap, generous empty space, no decorative graphics, no watermark.
Title: "三变量 RI-CLPM：纵向中介教学示意".
Vertical dashed divider. Narrow left area heading "个体间层面", exactly three circles stacked "RI_NSSI", "RI_AS", "RI_IC". Wider right area heading "个体内层面". Three columns T1, T2, T3, three rows of circles: top row "wNSSI1","wNSSI2","wNSSI3"; middle row "wAS1","wAS2","wAS3"; bottom row "wIC1","wIC2","wIC3". Exactly six thin gray horizontal autoregressive arrows connect adjacent times within each row. Highlight in lavender the two forward-time arrows wNSSI1→wAS2 labeled "a" and wAS2→wIC3 labeled "b". Add ONE curved long forward arrow wNSSI1→wIC3 below or around the network labeled "c′（lag-2）". Route paths so they do not overlap node labels. No arrows backward in time, no effects or coefficient numbers, no significance stars. Do not draw random intercepts pointing to within-person deviations. Stable covariance and measurement paths are deliberately omitted.
Legend: "NSSI：非自杀性自伤  AS：疏离感  IC：同一性混乱". A compact highlighted formula at bottom: "纵向间接效应 = a × b". Footer exactly: "教学示意：仅展示目标中介、直接路径与自回归路径，其余路径省略；不含实证估计值。". Do not claim to reproduce a published article figure.
```

三张图分别接入传统 CLPM、双变量 RI-CLPM、三变量纵向中介位置。随机截距与个体内成分未通过箭头直接相连；三变量示意图仅保留目标中介、lag-2 直接路径与自回归路径。
原稿中“真实模型图”及“以心理学报上的一个研究为例”两处引导句已调整为教学图表述，其余讲义内容保留。