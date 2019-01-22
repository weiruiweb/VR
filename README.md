# VR预约项目开发文档

### 目录

- 功能概述
- 数据对照表


---

**1\. 功能概述**

&emsp;&emsp;项目主要功能包括：对商家提供服务的预约，实现对服务预约的人数限制。一整套会员功能，实现多种支付方式，以及混合支付方式。

---
**2\. 数据对照表**

通用字段说明

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：该数据ID|
| listorder| int(11)|自定义排序 |
| create_time| int(11)|创建时间 |
| update_time| int(11)|更新时间 |
| delete_time| bigint(13)|删除时间 |
| thirdapp_id| int(11)|关联thirdapp |
| user_no| varchar(255)|关联创建人user_no|
| status| tinyint(2) |状态:1正常；-1删除 |

product表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| product_no | string| 商品编号|
| title| varchar(255)| 商品名称|
| description| varchar(255)| 商品描述|
| content | text| 商品详情 |
| mainImg | text|  商品主图 |
| bannerImg | text|  商品轮播图 |
| type| int(11)| 商品种类1.商品2.会员卡 |
| discount| int(11)| 会员卡折扣 |
| category_id| int(11)| 关联label商品类别 |
| stock| int(11)| 商品库存 |

flowlog表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| type | string| 流水类别：1.微信支付2.佣金3.积分6.会员卡7.会员卡折扣 |
| count| decimal(10,2)| 流水数量|
| trade_info| varchar(255) |  备注内容 |
| order_no| varchar(255) | 关联订单编号 |




label表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| title| varchar(40) | 菜单名称|
| description| text  | 描述 门店的地址用到，除此很少用到|
| parentid| int(11) | 父级菜单ID |
| mainImg | text|  门店的主图，除此很少用到 |
| bannerImg | text|  轮播有用到，比如首页轮播 |
| type | tinyint(2) |  1,menu;2,menu_item;3,category;5,sku;6,sku_item;7spu;8spu_item |




user表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| login_no | varchar(50) | 用户名|
| password| varchar(255)| 密码MD5|
| headImgUrl | varchar(9999) |  微信头像 |
| primary_scope| int(255) | 权限级别：90平台管理员；60超级管理员；30管理员；10用户 |
| scope| varchar(255) | cms端权限，string记录不可操作的模块id，空为无限制 |
| user_type| itinyint(10) | 0,小程序用户;2,cms用户; |
| user_no| varchar(255)|用户编号|
| parent_no| varchar(255) |父级用户编号|



order表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| id | int(11)| 主键：订单ID|
| order_no | 	varchar(255) | 订单号|
| pay| varchar(255)| 支付方式详情|
| pay_status | tinyint(2) |  0.未支付；1.已支付;3,已退款 |
| type| tinyint(2) | 1.普通商品,3.会员卡|
| order_step| 	tinyint(2)| 0.正常下单；1.申请撤单；2.完成撤单；3.完结 |
| transport_status | tinyint(2) | 0.待体验；1.已体验；|
| refund_no |  varchar(255)| 退单号 |
| discount| int(11)| 会员卡折扣 |
| balance| decimal(10) | 会员卡余额 |
| labelId| int(11) |关联门店 LabelId |
| timeId| int(11)|关联sku LabelId |

| bahaviour| tinyint(2) |订单是否已预约 |
| member | varchar(32)| 会员卡是否享受会员价：false否；true是 |

sku表

| 字段 | 类型 | 说明 |
| ------    | ------    | ------   | 
| sku_no |  varchar(255) | sku编号|
| price| decimal(10)| sku价格|
| mainImg | text | sku主图 |
| type| tinyint(2) | 1.普通商品,3.会员卡|
| order_step| tinyint(2) | 0.正常下单；1.申请撤单；2.完成撤单；3.完结 |
| transport_status | tinyint(2) | 0.待体验；1.已体验；|
| refund_no | varchar(255) | 退单号 |
| discount| int(11)| 会员卡折扣 |
| balance| decimal(10) | 会员卡余额 |
| labelId| int(11) |关联门店 LabelId |
| timeId| int(11)|关联sku LabelId |
| bahaviour| tinyint(2) |订单是否已预约 |
| member | varchar(32)| 会员卡是否享受会员价：false否；true是 |

---

