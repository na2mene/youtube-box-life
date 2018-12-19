class ScreenApp {

  /**
   * アプリケーションに必要なstate定義
   */
  constructor() {

    this.youtubeEndpoint  = 'https://www.googleapis.com/youtube/v3/search';
    this.defaultCondition = '?part=snippet&type=video&maxResults=8&order=date&videoEmbeddable=true';
    this.API_KEY          = '&key=【Your API KEY】';

    this.isSelectVideo    = false;
  }

  /**
   * 初期化処理
   */
  initialize() {

  }

  /**
   * Youtube Data API から動画を取得する
   */
  getYoutubeMovie(e) {
    const searchWord  = document.getElementById('SearchWord').value,
          videoListEl = document.getElementById('VideoList');

    //
    // VideoList要素の内部をクリア処理と
    // stateの初期化処理
    //
    while (videoListEl.firstChild) videoListEl.removeChild(videoListEl.firstChild);
    screenApp.videoId       = '';
    screenApp.isSelectVideo = false;

    fetch(
      screenApp.youtubeEndpoint + 
      screenApp.defaultCondition + 
      '&q=' + searchWord +
      screenApp.API_KEY
    )
    .then( response => response.json() )
    .then( json => {
      console.log(json);
      let items       = json.items;
      items.forEach(element => {
        console.log(element.snippet.title);
        console.log(element.id.videoId);
        screenApp._makeYoutubeCard(
          element.id.videoId,
          element.snippet.title,
          element.snippet.thumbnails.default.url
        );
      }, screenApp);
    });
  }

  /**
   * YoutubeのカードDOMを生成する
   * 
   * @param {*} videoId 
   * @param {*} title 
   * @param {*} thumbnailsSrc 
   */
  _makeYoutubeCard(videoId, title, thumbnailsSrc) {
    let videoList = document.getElementById('VideoList'),
        rootDiv = document.createElement('div'),
        h5      = document.createElement('h5'),
        img     = document.createElement('img');
    
    // クラス追加
    rootDiv.classList.add(
      'uk-card',
      'uk-card-default',
      'uk-card-body',
      'VideoItem'
    );
    // カードの大きさ指定
    rootDiv.style.width   = '320px';
    rootDiv.style.height  = '180px';
    rootDiv.style.display = 'inline-flex';
    rootDiv.style.cursor  = 'pointer';

    // videoIdセット
    rootDiv.dataset.videoId = videoId;

    // タイトルセット
    h5.textContent = title;

    // サムネセット
    img.src = thumbnailsSrc;

    // rootにセットする
    rootDiv.appendChild(h5);
    rootDiv.appendChild(img);

    // DOMへ反映
    videoList.appendChild(rootDiv);
  }

  /**
   * ビデオ選択時に、背景色の色を変更し、
   * 諸々のステートを更新する
   * 
   * @param {*} e 
   */
  changeBackgroundColor(e) {
    let el            = e.target,
        appSettingEl  = window.parent.document.getElementById('AppSettingBtn'), // 親要素のボタン
        isSelected    = false,
        isVideoItemEl = false;

    //
    // TODO: 無理やりidを取得して、空かどうかで、
    //       VideoItemが押されたのかを判断する
    //
    if (el.parentNode.id !== '') {
      isVideoItemEl = true;
    }

    //
    // VideoItemではなかったら、elの要素を上書きする
    //
    if (!isVideoItemEl) {
      el = el.parentNode;
    }

    //
    // 自身が選択済みかどうかチェック
    //
    el.classList.forEach( clazz => {
      if (clazz === 'SelectedVideo') {
        isSelected = true;
      }
    }, isSelected);

    // 選択済みなら解除してあげる
    if (isSelected) {

      el.classList.remove('SelectedVideo');
      appSettingEl.dataset.videoId = '';
      appSettingEl.dataset.targetScreen = '';
      screenApp.isSelectVideo = false;
    } else {

      // 全体で選択済みかどうか
      if (screenApp.isSelectVideo) {

        window.alert('1つのみ選択可能です。別の選択をする場合、再度クリックして解除してください');
      } else {

        el.classList.add('SelectedVideo');
        appSettingEl.dataset.videoId = el.dataset.videoId;    
        appSettingEl.dataset.targetScreen = document.getElementById('SelectScreen').value;
        screenApp.isSelectVideo = true;
      }
    }
  }

  /**
   * スクリーンに反映させる画面種別を更新する
   * 
   * @param {*} e 
   */
  changeSelectScreen(e) {
    let appSettingEl  = window.parent.document.getElementById('AppSettingBtn');
    appSettingEl.dataset.targetScreen = document.getElementById('SelectScreen').value;
  }

  /**
   * イベントの定義
   */
  eventLoader() {
    document.getElementById('getMovieBtn')
      .addEventListener('click', this.getYoutubeMovie);

    document.getElementById('VideoList')
      .addEventListener('click', this.changeBackgroundColor);

    document.getElementById('SelectScreen')
      .addEventListener('change', this.changeSelectScreen);
  }
}

const screenApp = new ScreenApp();
screenApp.initialize();
screenApp.eventLoader();
