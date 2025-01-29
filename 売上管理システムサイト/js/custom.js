function handleLocationClick(pLoc, e) {
  e.preventDefault(); // デフォルトのリンク動作を防ぐ
  const href = e.currentTarget.getAttribute('href');
  const url = new URL(href, window.location);  // 現在のオリジンを基準に相対パスを解決
  // alert(url);
  url.searchParams.set('pLoc', pLoc);
  window.location.href = url.toString();
  return false;
}

async function loadHeaderAndInitialize() {
  try {
    // ヘッダーの読み込みと挿入
    const response = await fetch("../commonUi/header.html");
    const data = await response.text();
    document.querySelector("#header").innerHTML = data;

    // location処理の実行
    const element = document.getElementById('location-parent');

    if (!element) {
      console.log('必要な要素が見つかりません');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pLoc = urlParams.get('pLoc');

    if (pLoc == 'スケルトン') {
      element.innerText = null;
      localStorage.setItem('location-parent', null);
      console.log("pLocが設定されました");
    } else if (pLoc) {
      element.innerText = pLoc;
      localStorage.setItem('location-parent', pLoc);
      console.log("pLocが設定されました");
    } else {
      const savedParentValue = localStorage.getItem('location-parent');
      if (savedParentValue) {
        element.innerText = savedParentValue;
        console.log('savedParentValueが設定されました');
      } else {
        element.innerHTML = null;
      }
    }
  } catch (error) {
    console.error('初期化に失敗:', error);
  }

  // urlパラメータの消去
  const url = new URL(window.location.href);
  const params = [];
  console.log(url);
  url.searchParams.forEach((element, key) => {
    params.push(key);
  });
  params.forEach((key) => {
    url.searchParams.delete(key);
  });
  history.replaceState(null, null, url)
}

// ページ読み込み時に実行
loadHeaderAndInitialize();