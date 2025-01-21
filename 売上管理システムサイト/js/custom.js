function handleLocationClick(pLoc, cLoc, e) {
  e.preventDefault(); // デフォルトのリンク動作を防ぐ
  const href = e.currentTarget.getAttribute('href');
  const url = new URL(href, window.location);  // 現在のオリジンを基準に相対パスを解決
  // alert(url);
  url.searchParams.set('pLoc', pLoc);
  url.searchParams.set('cLoc', cLoc);
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
    const elements = {
      parent: document.getElementById('location-parent'),
      child: document.getElementById('location-child')
    };

    if (!elements.parent || !elements.child) {
      console.log('必要な要素が見つかりません');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pLoc = urlParams.get('pLoc');
    const cLoc = urlParams.get('cLoc');

    if (pLoc == 'スケルトン') {
      elements['parent'].innerHTML = "<p></p>";
      localStorage.setItem('location-parent', '');
      console.log("pLocが設定されました");
    } else if (pLoc) {
      elements['parent'].innerText = pLoc;
      localStorage.setItem('location-parent', pLoc);
      console.log("pLocが設定されました");
    } else {
      const savedParentValue = localStorage.getItem('location-parent');
      if (savedParentValue) {
        elements['parent'].innerText = savedParentValue;
        console.log('savedParentValueが設定されました');
      } else {
        elements['parent'].innerHTML = "<p></p>";
      }
    }

    if (cLoc) {
      elements['child'].innerText = cLoc;
      localStorage.setItem('location-child', cLoc);
      console.log("cLocが設定されました");
    } else {
      const savedChildValue = localStorage.getItem('location-child');
      if (savedChildValue) {
        elements['child'].innerText = savedChildValue;
        console.log('savedChildValueが設定されました');
      } else {
        console.error('childの値は保存されていません');
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