class Screen {

  /**
   * スクリーンを生成に必要なパラメータ
   * 
   * @param {*} id youtubeID
   * @param {*} x 横
   * @param {*} y 高さ
   * @param {*} z 奥行き
   * @param {*} ry 縦軸回転
   * @param {*} rx 横軸回転
   */
  constructor(id, x, y, z, ry, rx = 0, rz = 0) {
    this.id = id;
    this.x  = x;
    this.y  = y;
    this.z  = z;
    this.ry = ry;
    this.rx = rx;
    this.rz = rz;
  }
  
  /**
   * スクリーン工場のエントリーポイント
   * 
   * @return screen
   */
  factory(type = 'default') {
    let screen = null;
    
    switch(type) {
      case 'side':
        screen = this._create({
          width  : '480px',
          height : '360px'
        },{
          width  : '480px',
          height : '360px',
          border : '0px'
        });
        break;
      case 'bottom':
        screen = this._create({
          width  : '480px',
          height : '480px'
        },{
          width  : '480px',
          height : '480px',
          border : '0px'
        });
        break;
      default:
        console.error('指定してくれYO');
    }

    return screen;
  }

  /**
   * スクリーンを生成する
   * 
   * @param {Object} divOption 
   * @param {Object} iframeOption 
   */
  _create(divOption, iframeOption) {
    let div = document.createElement('div'), 
        iframe = document.createElement('iframe'),
        object = null;

    div.style.width           = divOption.width;
    div.style.height          = divOption.height
    div.style.backgroundColor = '#000';

    iframe.style.width  = iframeOption.width;
    iframe.style.height = iframeOption.height;
    iframe.style.border = iframeOption.border;
  
    iframe.src = ['https://www.youtube.com/embed/', this.id].join('');
    
    div.appendChild(iframe);

    object = new THREE.CSS3DObject(div);

    object.position.set(this.x, this.y, this.z);
    object.rotation.y = this.ry;
    object.rotation.x = this.rx;
    object.rotation.z = this.rz;

    return object;
  }
}