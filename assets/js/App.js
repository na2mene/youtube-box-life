class App {

  /**
   * アプリケーションに必要なstate定義
   */
  constructor() {

    // カメラの設定
    this.camera   = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 5000 );
    this.camera.position.set( 500, 350, 750 );

    // シーンの設定
    this.scene    = new THREE.Scene();

    // レンダラーの設定
    this.renderer = new THREE.CSS3DRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    // コントローラの設定
    this.controls = new THREE.TrackballControls(this.camera);

    // スクリーンコントローラモードのステート
    this.isScreenControllerMode = false;
  }

  /**
   * 初期化処理
   */
  initialize() {
    const container = document.getElementById('Container'), // コンテナ取得
          blocker   = document.getElementById('Blocker');   // ブロッカー取得
    let   group     = new THREE.Group(),                    // グループ作成
          screen    = null,
          spinner   = document.getElementById('SpinnerPosition'),
          indicator = document.getElementById('Indicator');

    spinner.style.display = 'block';
    spinner.style.top     = window.innerHeight / 2 + 'px';
    spinner.style.left    = window.innerWidth / 2 + 'px';

    // コンテナへ追加
    container.appendChild( this.renderer.domElement );

    // メインスクリーン
    screen = new Screen(
      'eOAqw6MuCX8', // youtubeID
      0, 0, 240,     // x, y, z
      0              // ry
    );
    group.add(screen.factory('side'));

    // メインライトスクリーン
    screen = new Screen(
      'EWodDd-8RYA', 
      240, 0, 0, 
      Math.PI / 2
    );
    group.add(screen.factory('side'));

    // メインリバーススクリーン
    screen = new Screen(
      'PHVPy_-BHCg', 
      0, 0, -240, 
      Math.PI
    );
    group.add(screen.factory('side'));

    // メインレフトスクリーン
    screen = new Screen(
      '75AfDdeS3Is', 
      -240, 0, 0, 
      -Math.PI / 2
    );
    group.add(screen.factory('side'));

    // 天井スクリーン
    screen = new Screen(
      'fZNsBa7Wr7c', 
      0, 180, 0, // x, y, z
      0, -Math.PI / 2, Math.PI // ry, rx, rz
    );
    group.add(screen.factory('bottom'));

    // 底面スクリーン
    screen = new Screen(
      'IULHwNjhP9E', 
      0, -180, 0, // x, y, z
      -Math.PI, -Math.PI / 2, Math.PI // ry, rx, rz
    );
    group.add(screen.factory('bottom'));

    // シーンへスクリーンを追加する
    this.scene.add(group);

    // ドラッグしてコントローラする時の速度設定
    this.controls.rotateSpeed = 5;

    // カメラドラッグ時に、iframeイベントをブロックする
    blocker.style.display = 'none';
    
    // 社内アドベント流行りのスリープwww
    setTimeout(() => {
      indicator.style.display = 'none';
    }, 4500);
  }

  /**
   * アニメイトの処理
   */
  animate() {
    // thisが変化する初回以外は、Globalのappインスタンスを使用する
    const self = this === null ? app : this;
    requestAnimationFrame(self.animate);
    self.controls.update();
    self.renderer.render(self.scene, self.camera);
  }

  /**
   * ブラウザのリサイズを実行する
   */
  onWindowResize() {
    const self = app;
    self.camera.aspect = window.innerWidth / window.innerHeight;
    self.camera.updateProjectionMatrix();
    self.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  /**
   * スクリーンコントローラの切り替え
   */
  changeScreenController(e) {
    const self              = app;
    let screenController    = document.getElementById('ScreenController'),
        screenControllerBtn = document.getElementById('ScreenControllerBtn'),
        settingBtn          = document.getElementById('AppSettingBtn');

    //
    // モードによって切り替える
    //
    if (self.isScreenControllerMode) { // 閲覧モードに戻す
      screenControllerBtn.textContent = 'Call up controller';
      settingBtn.disabled             = true;
      screenController.style.display  = 'none';
      self.isScreenControllerMode     = false;
    } else {                           // 編集モードに変更する
      screenControllerBtn.textContent = 'Close controller';
      settingBtn.disabled             = false;
      screenController.style.display  = 'block';
      self.isScreenControllerMode     = true;
    }
  }

  /**
   * 設定反映の確認
   * 
   * @param {*} e eventオブジェクト
   */
  confirmSetting(e) {
    const self = app;
    let el     = e.target;
    if (window.confirm('【注意！】画面反映先で、再生している場合、音声が残るので、停止してください。画面を反映させますか？(【Caution! 】 If you are playing back the screen, the sound will remain, please stop it. Do you want to reflect the screen?)')){
      self._generateScreen(el.dataset.videoId, el.dataset.targetScreen);
      self.changeScreenController();
    }
  }

  /**
   * スクリーンの再生成
   * 
   * @param {*} e 
   */
  _generateScreen(videoId, screenType) {
    let group     = new THREE.Group(),
        screen    = null;
    
    switch (screenType) {
      case '1':
        // メインスクリーン
        screen = new Screen(
          videoId,
          0, 0, 240,
          0
        );
        group.add(screen.factory('side'));
        break;
      case '2':
        // メインライトスクリーン
        screen = new Screen(
          videoId, 
          240, 0, 0, 
          Math.PI / 2
        );
        group.add(screen.factory('side'));
        break;
      case '3':
        // メインリバーススクリーン
        screen = new Screen(
          videoId,
          0, 0, -240, 
          Math.PI
        );
        group.add(screen.factory('side'));
        break;
      case '4':
        // メインレフトスクリーン
        screen = new Screen(
          videoId,
          -240, 0, 0, 
          -Math.PI / 2
        );
        group.add(screen.factory('side'));
        break;
      case '5':
        // 天井スクリーン
        screen = new Screen(
          videoId,
          0, 180, 0,
          0, -Math.PI / 2, Math.PI
        );
        group.add(screen.factory('bottom'));
        break;
      case '6':
        // 底面スクリーン
        screen = new Screen(
          videoId,
          0, -180, 0, // x, y, z
          -Math.PI, -Math.PI / 2, Math.PI // ry, rx, rz
        );
        group.add(screen.factory('bottom'));
        break;

      default:
        console.error('予期せぬエラーが発生しました。')
    }
    app.scene.add(group);
  }

  /**
   * イベントの定義
   */
  eventLoader() {

    document.addEventListener('mousedown', () => {
      window.Blocker.style.display = '';
    });
    document.addEventListener('mouseup', () => {
      window.Blocker.style.display = 'none';
    });
    document.addEventListener('keydown', e => {
      if (e.target.tabIndex === 0) return false;
    });
    window.addEventListener('resize', this.onWindowResize);

    document.getElementById('ScreenControllerBtn')
      .addEventListener('click', this.changeScreenController);

    document.getElementById('AppSettingBtn')
      .addEventListener('click', this.confirmSetting);
  }
}

const app = new App();
app.initialize();
app.eventLoader();
app.animate();