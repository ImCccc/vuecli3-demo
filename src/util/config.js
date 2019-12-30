// 菜单
export const menuList = [
  {
    title: '菜单1',
    path: '/menu1',
    icon: 'icon-shebeiweihuguanli',
    authority: 0,
    children: []
  },
  {
    title: '菜单2',
    path: '/menu2',
    icon: 'icon-caipinguanli',
    authority: 0,
    children: [
      {
        title: '菜单2-1',
        path: '/menu21',
        authority: 0,
        children: []
      },
      {
        title: '菜单2-2',
        path: '/menu22',
        icon: 'icon-caipinguanli',
        authority: 0,
        children: []
      }
    ]
  }
];

export const sourceKey = {
  deviceSold: 'DEVICE_SOLD', // 设备是否售出
  network: 'NW', // 网络来源
  deviceType: 'DEVICETYPE', // 设备类型
  agv: 'AGV', // AGV
  arduinoBoard: 'ARDUINO', // arduino版
  camera: 'SXT', // 摄像头
  upperPad: 'SWJ', // 上位机平板
  mcuBoard: 'MCU', // MCU板
  voiceBoard: 'YYB', // 语音板
  projector: 'TYY', // 投影仪
  roboticArm: 'JXB', // 机械臂
  versionEnable: 'VERSIONENABLE', // 版本是否可用
  deviceState: 'DEVS', // 设备状态
  industryType: 'INDUSTRYTYPE', // 行业类型
  status: 'STATUS', // 设备状态
};