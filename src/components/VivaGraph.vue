<template>
  <div class="fit">
    <VivaGraphRender ref="vgRender" :graph="graphStore.graph" :graphics="graphStore.graphics" />
    <!-- <input type="text" id="input_cnpj" name="input_cnpj" size="18" value="" onkeydown="menu_input_cnpj(this)" onfocusin="graphStore.ativaAtalhos(false)" onfocusout="graphStore.ativaAtalhos(true);" title="Digite  CNPJ, Razão Social, Nome Fantasia, CPF de sócio ou Nome de sócio e pressione Enter. Os nomes podem ter acentuação ou estar com letras minúsculas, pois o texto é convertido em maiúsculas sem acentuação. CNPJS e CPFs podem ter pontos, traços ou barras. Para buscar por Unidade Gestora, coloque UG_NNNNNN, onde NNNNNN é o código da UG. A busca por endereço, por telefone ou por email ainda não foi implementada."> -->
    <SmartSearchField label="Pesquisa" @search="onSearch"></SmartSearchField>
  </div>
</template>

<script setup>
import Viva from 'vivagraphjs';
import VivaGraphRender from 'src/components/VivaGraphRender.vue';
import { onMounted, ref } from 'vue';
import { useGraphStore } from 'src/stores/graph.store.js'
import { useMenuStore } from 'src/stores/menu.store.js'
import SmartSearchField from 'src/components/SmartSearchField.vue'
import { useDialogPluginComponent } from 'quasar';


const graphStore = useGraphStore();
const menuStore = useMenuStore();
const vgRender = ref(null);


var mock = {"bBaseFullTextSearch": 0, "bBaseLocal": 1, "bBaseReceita": 1, "bMenuInserirInicial": true, "bbusca_chaves": false, "bgrafico_no_servidor": false, "btextoEmbaixoIcone": true, "camada": 0, "chrome": true, "cpfcnpj": "", "firefox": false, "geocode_max": 10, "idArquivoServidor": "", "inserirDefault": "", "itensFlag": ["situacao_fiscal", "pep", "ceis", "cepim", "cnep", "acordo_leni\u00eancia", "ceaf", "pgfn-fgts", "pgfn-sida", "pgfn-prev", "servidor_siape"], "json": "", "lista": "", "listaImagens": ["500px.png", "address-book-o.png", "address-book.png", "address-card-o.png", "address-card.png", "adjust.png", "adn.png", "align-center.png", "align-justify.png", "align-left.png", "align-right.png", "amazon.png", "ambulance.png", "american-sign-language-interpreting.png", "anchor.png", "android.png", "angellist.png", "angle-double-down.png", "angle-double-left.png", "angle-double-right.png", "angle-double-up.png", "angle-down.png", "angle-left.png", "angle-right.png", "angle-up.png", "apple.png", "archive.png", "area-chart.png", "arrow-circle-down.png", "arrow-circle-left.png", "arrow-circle-o-down.png", "arrow-circle-o-left.png", "arrow-circle-o-right.png", "arrow-circle-o-up.png", "arrow-circle-right.png", "arrow-circle-up.png", "arrow-down.png", "arrow-left.png", "arrow-right.png", "arrow-up.png", "arrows-alt.png", "arrows-h.png", "arrows-v.png", "arrows.png", "asl-interpreting.png", "assistive-listening-systems.png", "asterisk.png", "at.png", "audio-description.png", "automobile.png", "backward.png", "balance-scale.png", "ban.png", "bandcamp.png", "bank.png", "bar-chart-o.png", "bar-chart.png", "barcode.png", "bars.png", "bath.png", "bathtub.png", "battery-0.png", "battery-1.png", "battery-2.png", "battery-3.png", "battery-4.png", "battery-empty.png", "battery-full.png", "battery-half.png", "battery-quarter.png", "battery-three-quarters.png", "battery.png", "bed.png", "beer.png", "behance-square.png", "behance.png", "bell-o.png", "bell-slash-o.png", "bell-slash.png", "bell.png", "bicycle.png", "binary.png", "binoculars.png", "birthday-cake.png", "bitbucket-square.png", "bitbucket.png", "bitcoin.png", "black-tie.png", "blind.png", "bluetooth-b.png", "bluetooth.png", "bold.png", "bolt.png", "bomb.png", "book.png", "bookmark-o.png", "bookmark.png", "braille.png", "briefcase.png", "btc.png", "bug.png", "building-o.png", "building.png", "bullhorn.png", "bullseye.png", "bus.png", "buysellads.png", "cab.png", "calculator.png", "calendar-check-o.png", "calendar-minus-o.png", "calendar-o.png", "calendar-plus-o.png", "calendar-times-o.png", "calendar.png", "camera-retro.png", "camera.png", "car.png", "caret-down.png", "caret-left.png", "caret-right.png", "caret-square-o-down.png", "caret-square-o-left.png", "caret-square-o-right.png", "caret-square-o-up.png", "caret-up.png", "cart-arrow-down.png", "cart-plus.png", "cc-amex.png", "cc-diners-club.png", "cc-discover.png", "cc-jcb.png", "cc-mastercard.png", "cc-paypal.png", "cc-stripe.png", "cc-visa.png", "cc.png", "certificate.png", "chain-broken.png", "chain.png", "check-circle-o.png", "check-circle.png", "check-square-o.png", "check-square.png", "check.png", "chevron-circle-down.png", "chevron-circle-left.png", "chevron-circle-right.png", "chevron-circle-up.png", "chevron-down.png", "chevron-left.png", "chevron-right.png", "chevron-up.png", "child.png", "chrome.png", "circle-o-notch.png", "circle-o.png", "circle-thin.png", "circle.png", "clipboard.png", "clock-o.png", "clone.png", "close.png", "cloud-download.png", "cloud-upload.png", "cloud.png", "cny.png", "code-fork.png", "code.png", "codepen.png", "codiepie.png", "coffee.png", "cog.png", "cogs.png", "columns.png", "comment-o.png", "comment.png", "commenting-o.png", "commenting.png", "comments-o.png", "comments.png", "compass.png", "compress.png", "connectdevelop.png", "contao.png", "copy.png", "copyright.png", "creative-commons.png", "credit-card-alt.png", "credit-card.png", "crop.png", "crosshairs.png", "css3.png", "cube.png", "cubes.png", "cut.png", "cutlery.png", "dashboard.png", "dashcube.png", "database.png", "deaf.png", "deafness.png", "dedent.png", "delicious.png", "desktop.png", "deviantart.png", "diamond.png", "digg.png", "dollar.png", "dot-circle-o.png", "download.png", "dribbble.png", "drivers-license-o.png", "drivers-license.png", "dropbox.png", "drupal.png", "edge.png", "edit.png", "eercast.png", "eject.png", "ellipsis-h.png", "ellipsis-v.png", "empire.png", "envelope-o.png", "envelope-open-o.png", "envelope-open.png", "envelope-square.png", "envelope.png", "envira.png", "eraser.png", "etsy.png", "eur.png", "euro.png", "exchange.png", "exclamation-circle.png", "exclamation-triangle.png", "exclamation.png", "expand.png", "expeditedssl.png", "external-link-square.png", "external-link.png", "eye-slash.png", "eye.png", "eyedropper.png", "fa.png", "facebook-f.png", "facebook-official.png", "facebook-square.png", "facebook.png", "fast-backward.png", "fast-forward.png", "fax.png", "feed.png", "female.png", "fighter-jet.png", "file-archive-o.png", "file-audio-o.png", "file-code-o.png", "file-excel-o.png", "file-image-o.png", "file-movie-o.png", "file-o.png", "file-pdf-o.png", "file-photo-o.png", "file-picture-o.png", "file-powerpoint-o.png", "file-sound-o.png", "file-text-o.png", "file-text.png", "file-video-o.png", "file-word-o.png", "file-zip-o.png", "file.png", "files-o.png", "film.png", "filter.png", "fire-extinguisher.png", "fire.png", "firefox.png", "first-order.png", "flag-checkered.png", "flag-o.png", "flag.png", "flag_red.png", "flash.png", "flask.png", "flickr.png", "floppy-o.png", "folder-o.png", "folder-open-o.png", "folder-open.png", "folder.png", "font-awesome.png", "font.png", "fonticons.png", "fort-awesome.png", "forumbee.png", "forward.png", "foursquare.png", "free-code-camp.png", "frown-o.png", "futbol-o.png", "gamepad.png", "gavel.png", "gbp.png", "ge.png", "gear.png", "gears.png", "genderless.png", "get-pocket.png", "gg-circle.png", "gg.png", "gift.png", "git-square.png", "git.png", "github-alt.png", "github-square.png", "github.png", "gitlab.png", "gittip.png", "glass.png", "glide-g.png", "glide.png", "globe.png", "google-plus-circle.png", "google-plus-official.png", "google-plus-square.png", "google-plus.png", "google-wallet.png", "google.png", "graduation-cap.png", "gratipay.png", "grav.png", "group.png", "h-square.png", "hacker-news.png", "hand-grab-o.png", "hand-lizard-o.png", "hand-o-down.png", "hand-o-left.png", "hand-o-right.png", "hand-o-up.png", "hand-paper-o.png", "hand-peace-o.png", "hand-pointer-o.png", "hand-rock-o.png", "hand-scissors-o.png", "hand-spock-o.png", "hand-stop-o.png", "handshake-o.png", "hard-of-hearing.png", "hashtag.png", "hdd-o.png", "header.png", "headphones.png", "heart-o.png", "heart.png", "heartbeat.png", "history.png", "home.png", "hospital-o.png", "hotel.png", "hourglass-1.png", "hourglass-2.png", "hourglass-3.png", "hourglass-end.png", "hourglass-half.png", "hourglass-o.png", "hourglass-start.png", "hourglass.png", "houzz.png", "html5.png", "i-cursor.png", "icone-grafo-conta.png", "icone-grafo-desconhecido.png", "icone-grafo-email.png", "icone-grafo-empresa-estrangeira.png", "icone-grafo-empresa-fundacao.png", "icone-grafo-empresa-individual.png", "icone-grafo-empresa-publica.png", "icone-grafo-empresa.png", "icone-grafo-endereco.png", "icone-grafo-feminino.png", "icone-grafo-file.png", "icone-grafo-id.png", "icone-grafo-masculino.png", "icone-grafo-telefone.png", "icone-grafo-ug.png", "id-badge.png", "id-card-o.png", "id-card.png", "ils.png", "image.png", "imdb.png", "inbox.png", "indent.png", "industry.png", "info-circle.png", "info.png", "inr.png", "instagram.png", "institution.png", "internet-explorer.png", "intersex.png", "ioxhost.png", "italic.png", "joomla.png", "jpy.png", "jsfiddle.png", "key.png", "keyboard-o.png", "krw.png", "language.png", "laptop.png", "lastfm-square.png", "lastfm.png", "leaf.png", "leanpub.png", "legal.png", "lemon-o.png", "level-down.png", "level-up.png", "life-bouy.png", "life-buoy.png", "life-ring.png", "life-saver.png", "lightbulb-o.png", "line-chart.png", "link.png", "linkedin-square.png", "linkedin.png", "linode.png", "linux.png", "list-alt.png", "list-ol.png", "list-ul.png", "list.png", "location-arrow.png", "lock.png", "long-arrow-down.png", "long-arrow-left.png", "long-arrow-right.png", "long-arrow-up.png", "low-vision.png", "magic.png", "magnet.png", "mail-forward.png", "mail-reply-all.png", "mail-reply.png", "male.png", "map-marker.png", "map-o.png", "map-pin.png", "map-signs.png", "map.png", "mars-double.png", "mars-stroke-h.png", "mars-stroke-v.png", "mars-stroke.png", "mars.png", "maxcdn.png", "meanpath.png", "medium.png", "medkit.png", "meetup.png", "meh-o.png", "mercury.png", "microchip.png", "microphone-slash.png", "microphone.png", "minus-circle.png", "minus-square-o.png", "minus-square.png", "minus.png", "mixcloud.png", "mobile-phone.png", "mobile.png", "modx.png", "money.png", "moon-o.png", "mortar-board.png", "motorcycle.png", "mouse-pointer.png", "music.png", "navicon.png", "neuter.png", "newspaper-o.png", "object-group.png", "object-ungroup.png", "odnoklassniki-square.png", "odnoklassniki.png", "opencart.png", "openid.png", "opera.png", "optin-monster.png", "outdent.png", "pagelines.png", "paint-brush.png", "paper-plane-o.png", "paper-plane.png", "paperclip.png", "paragraph.png", "paste.png", "pause-circle-o.png", "pause-circle.png", "pause.png", "paw.png", "paypal.png", "pencil-square-o.png", "pencil-square.png", "pencil.png", "percent.png", "phone-square.png", "phone.png", "photo.png", "picture-o.png", "pie-chart.png", "pied-piper-alt.png", "pied-piper-pp.png", "pied-piper.png", "pinterest-p.png", "pinterest-square.png", "pinterest.png", "plane.png", "play-circle-o.png", "play-circle.png", "play.png", "plug.png", "plus-circle.png", "plus-square-o.png", "plus-square.png", "plus.png", "podcast.png", "power-off.png", "print.png", "product-hunt.png", "puzzle-piece.png", "python-color.png", "python.png", "qq.png", "qrcode.png", "question-circle-o.png", "question-circle.png", "question.png", "quora.png", "quote-left.png", "quote-right.png", "ra.png", "random.png", "ravelry.png", "rebel.png", "recycle.png", "reddit-alien.png", "reddit-square.png", "reddit.png", "refresh.png", "registered.png", "remove.png", "renren.png", "reorder.png", "repeat.png", "reply-all.png", "reply.png", "resistance.png", "retweet.png", "rmb.png", "road.png", "rocket.png", "rotate-left.png", "rotate-right.png", "rouble.png", "rss-square.png", "rss.png", "rub.png", "ruble.png", "rupee.png", "s15.png", "safari.png", "save.png", "scissors.png", "scribd.png", "search-minus.png", "search-plus.png", "search.png", "sellsy.png", "send-o.png", "send.png", "server.png", "share-alt-square.png", "share-alt.png", "share-square-o.png", "share-square.png", "share.png", "shekel.png", "sheqel.png", "shield.png", "ship.png", "shirtsinbulk.png", "shopping-bag.png", "shopping-basket.png", "shopping-cart.png", "shower.png", "sign-in.png", "sign-language.png", "sign-out.png", "signal.png", "signing.png", "simplybuilt.png", "sitemap.png", "skyatlas.png", "skype.png", "slack.png", "sliders.png", "slideshare.png", "smile-o.png", "snapchat-ghost.png", "snapchat-square.png", "snapchat.png", "snowflake-o.png", "soccer-ball-o.png", "sort-alpha-asc.png", "sort-alpha-desc.png", "sort-amount-asc.png", "sort-amount-desc.png", "sort-asc.png", "sort-desc.png", "sort-down.png", "sort-numeric-asc.png", "sort-numeric-desc.png", "sort-up.png", "sort.png", "soundcloud.png", "space-shuttle.png", "spinner.png", "spoon.png", "spotify.png", "square-o.png", "square.png", "stack-exchange.png", "stack-overflow.png", "star-half-empty.png", "star-half-full.png", "star-half-o.png", "star-half.png", "star-o.png", "star.png", "steam-square.png", "steam.png", "step-backward.png", "step-forward.png", "stethoscope.png", "sticky-note-o.png", "sticky-note.png", "stop-circle-o.png", "stop-circle.png", "stop.png", "street-view.png", "strikethrough.png", "stumbleupon-circle.png", "stumbleupon.png", "subscript.png", "subway.png", "suitcase.png", "sun-o.png", "superpowers.png", "superscript.png", "support.png", "table.png", "tablet.png", "tachometer.png", "tag.png", "tags.png", "tasks.png", "taxi.png", "telegram.png", "television.png", "tencent-weibo.png", "terminal.png", "text-height.png", "text-width.png", "th-large.png", "th-list.png", "th.png", "themeisle.png", "thermometer-0.png", "thermometer-1.png", "thermometer-2.png", "thermometer-3.png", "thermometer-4.png", "thermometer-empty.png", "thermometer-full.png", "thermometer-half.png", "thermometer-quarter.png", "thermometer-three-quarters.png", "thermometer.png", "thumb-tack.png", "thumbs-down.png", "thumbs-o-down.png", "thumbs-o-up.png", "thumbs-up.png", "ticket.png", "times-circle-o.png", "times-circle.png", "times-rectangle-o.png", "times-rectangle.png", "times.png", "tint.png", "toggle-down.png", "toggle-left.png", "toggle-off.png", "toggle-on.png", "toggle-right.png", "toggle-up.png", "trademark.png", "train.png", "transgender-alt.png", "transgender.png", "trash-o.png", "trash.png", "tree.png", "trello.png", "tripadvisor.png", "trophy.png", "truck.png", "try.png", "tty.png", "tumblr-square.png", "tumblr.png", "turkish-lira.png", "tv.png", "twitch.png", "twitter-square.png", "twitter.png", "umbrella.png", "underline.png", "undo.png", "universal-access.png", "university.png", "unlink.png", "unlock-alt.png", "unlock.png", "unsorted.png", "upload.png", "usb.png", "usd.png", "user-circle-o.png", "user-circle.png", "user-md.png", "user-o.png", "user-plus.png", "user-secret.png", "user-times.png", "user.png", "users.png", "vcard-o.png", "vcard.png", "venus-double.png", "venus-mars.png", "venus.png", "viacoin.png", "viadeo-square.png", "viadeo.png", "video-camera.png", "vimeo-square.png", "vimeo.png", "vine.png", "vk.png", "volume-control-phone.png", "volume-down.png", "volume-off.png", "volume-up.png", "warning.png", "wechat.png", "weibo.png", "weixin.png", "whatsapp.png", "wheelchair-alt.png", "wheelchair.png", "wifi.png", "wikipedia-w.png", "window-close-o.png", "window-close.png", "window-maximize.png", "window-minimize.png", "window-restore.png", "windows.png", "won.png", "wordpress.png", "wpbeginner.png", "wpexplorer.png", "wpforms.png", "wrench.png", "xing-square.png", "xing.png", "y-combinator-square.png", "y-combinator.png", "yahoo.png", "yc-square.png", "yc.png", "yelp.png", "yen.png", "yoast.png", "youtube-play.png", "youtube-square.png", "youtube.png"], "mensagem": "BASE DE TESTE COM NOMES EMBARALHADOS. N\u00c3O \u00c9 POSS\u00cdVEL FAZER BUSCA POR NOMES, APENAS INSER\u00c7\u00c3O DE TESTE (VAZIO E OK NA JANELA DE INSER\u00c7\u00c3O)\n", "mobile": false, "referenciaBD": "TESTE", "referenciaBDCurto": "TESTE", "usuarioLocal": true};;

graphStore.inicio = mock;
graphStore.listaImagens = ["500px.png", "address-book-o.png", "address-book.png", "address-card-o.png", "address-card.png", "adjust.png", "adn.png", "align-center.png", "align-justify.png", "align-left.png", "align-right.png", "amazon.png", "ambulance.png", "american-sign-language-interpreting.png", "anchor.png", "android.png", "angellist.png", "angle-double-down.png", "angle-double-left.png", "angle-double-right.png", "angle-double-up.png", "angle-down.png", "angle-left.png", "angle-right.png", "angle-up.png", "apple.png", "archive.png", "area-chart.png", "arrow-circle-down.png", "arrow-circle-left.png", "arrow-circle-o-down.png", "arrow-circle-o-left.png", "arrow-circle-o-right.png", "arrow-circle-o-up.png", "arrow-circle-right.png", "arrow-circle-up.png", "arrow-down.png", "arrow-left.png", "arrow-right.png", "arrow-up.png", "arrows-alt.png", "arrows-h.png", "arrows-v.png", "arrows.png", "asl-interpreting.png", "assistive-listening-systems.png", "asterisk.png", "at.png", "audio-description.png", "automobile.png", "backward.png", "balance-scale.png", "ban.png", "bandcamp.png", "bank.png", "bar-chart-o.png", "bar-chart.png", "barcode.png", "bars.png", "bath.png", "bathtub.png", "battery-0.png", "battery-1.png", "battery-2.png", "battery-3.png", "battery-4.png", "battery-empty.png", "battery-full.png", "battery-half.png", "battery-quarter.png", "battery-three-quarters.png", "battery.png", "bed.png", "beer.png", "behance-square.png", "behance.png", "bell-o.png", "bell-slash-o.png", "bell-slash.png", "bell.png", "bicycle.png", "binary.png", "binoculars.png", "birthday-cake.png", "bitbucket-square.png", "bitbucket.png", "bitcoin.png", "black-tie.png", "blind.png", "bluetooth-b.png", "bluetooth.png", "bold.png", "bolt.png", "bomb.png", "book.png", "bookmark-o.png", "bookmark.png", "braille.png", "briefcase.png", "btc.png", "bug.png", "building-o.png", "building.png", "bullhorn.png", "bullseye.png", "bus.png", "buysellads.png", "cab.png", "calculator.png", "calendar-check-o.png", "calendar-minus-o.png", "calendar-o.png", "calendar-plus-o.png", "calendar-times-o.png", "calendar.png", "camera-retro.png", "camera.png", "car.png", "caret-down.png", "caret-left.png", "caret-right.png", "caret-square-o-down.png", "caret-square-o-left.png", "caret-square-o-right.png", "caret-square-o-up.png", "caret-up.png", "cart-arrow-down.png", "cart-plus.png", "cc-amex.png", "cc-diners-club.png", "cc-discover.png", "cc-jcb.png", "cc-mastercard.png", "cc-paypal.png", "cc-stripe.png", "cc-visa.png", "cc.png", "certificate.png", "chain-broken.png", "chain.png", "check-circle-o.png", "check-circle.png", "check-square-o.png", "check-square.png", "check.png", "chevron-circle-down.png", "chevron-circle-left.png", "chevron-circle-right.png", "chevron-circle-up.png", "chevron-down.png", "chevron-left.png", "chevron-right.png", "chevron-up.png", "child.png", "chrome.png", "circle-o-notch.png", "circle-o.png", "circle-thin.png", "circle.png", "clipboard.png", "clock-o.png", "clone.png", "close.png", "cloud-download.png", "cloud-upload.png", "cloud.png", "cny.png", "code-fork.png", "code.png", "codepen.png", "codiepie.png", "coffee.png", "cog.png", "cogs.png", "columns.png", "comment-o.png", "comment.png", "commenting-o.png", "commenting.png", "comments-o.png", "comments.png", "compass.png", "compress.png", "connectdevelop.png", "contao.png", "copy.png", "copyright.png", "creative-commons.png", "credit-card-alt.png", "credit-card.png", "crop.png", "crosshairs.png", "css3.png", "cube.png", "cubes.png", "cut.png", "cutlery.png", "dashboard.png", "dashcube.png", "database.png", "deaf.png", "deafness.png", "dedent.png", "delicious.png", "desktop.png", "deviantart.png", "diamond.png", "digg.png", "dollar.png", "dot-circle-o.png", "download.png", "dribbble.png", "drivers-license-o.png", "drivers-license.png", "dropbox.png", "drupal.png", "edge.png", "edit.png", "eercast.png", "eject.png", "ellipsis-h.png", "ellipsis-v.png", "empire.png", "envelope-o.png", "envelope-open-o.png", "envelope-open.png", "envelope-square.png", "envelope.png", "envira.png", "eraser.png", "etsy.png", "eur.png", "euro.png", "exchange.png", "exclamation-circle.png", "exclamation-triangle.png", "exclamation.png", "expand.png", "expeditedssl.png", "external-link-square.png", "external-link.png", "eye-slash.png", "eye.png", "eyedropper.png", "fa.png", "facebook-f.png", "facebook-official.png", "facebook-square.png", "facebook.png", "fast-backward.png", "fast-forward.png", "fax.png", "feed.png", "female.png", "fighter-jet.png", "file-archive-o.png", "file-audio-o.png", "file-code-o.png", "file-excel-o.png", "file-image-o.png", "file-movie-o.png", "file-o.png", "file-pdf-o.png", "file-photo-o.png", "file-picture-o.png", "file-powerpoint-o.png", "file-sound-o.png", "file-text-o.png", "file-text.png", "file-video-o.png", "file-word-o.png", "file-zip-o.png", "file.png", "files-o.png", "film.png", "filter.png", "fire-extinguisher.png", "fire.png", "firefox.png", "first-order.png", "flag-checkered.png", "flag-o.png", "flag.png", "flag_red.png", "flash.png", "flask.png", "flickr.png", "floppy-o.png", "folder-o.png", "folder-open-o.png", "folder-open.png", "folder.png", "font-awesome.png", "font.png", "fonticons.png", "fort-awesome.png", "forumbee.png", "forward.png", "foursquare.png", "free-code-camp.png", "frown-o.png", "futbol-o.png", "gamepad.png", "gavel.png", "gbp.png", "ge.png", "gear.png", "gears.png", "genderless.png", "get-pocket.png", "gg-circle.png", "gg.png", "gift.png", "git-square.png", "git.png", "github-alt.png", "github-square.png", "github.png", "gitlab.png", "gittip.png", "glass.png", "glide-g.png", "glide.png", "globe.png", "google-plus-circle.png", "google-plus-official.png", "google-plus-square.png", "google-plus.png", "google-wallet.png", "google.png", "graduation-cap.png", "gratipay.png", "grav.png", "group.png", "h-square.png", "hacker-news.png", "hand-grab-o.png", "hand-lizard-o.png", "hand-o-down.png", "hand-o-left.png", "hand-o-right.png", "hand-o-up.png", "hand-paper-o.png", "hand-peace-o.png", "hand-pointer-o.png", "hand-rock-o.png", "hand-scissors-o.png", "hand-spock-o.png", "hand-stop-o.png", "handshake-o.png", "hard-of-hearing.png", "hashtag.png", "hdd-o.png", "header.png", "headphones.png", "heart-o.png", "heart.png", "heartbeat.png", "history.png", "home.png", "hospital-o.png", "hotel.png", "hourglass-1.png", "hourglass-2.png", "hourglass-3.png", "hourglass-end.png", "hourglass-half.png", "hourglass-o.png", "hourglass-start.png", "hourglass.png", "houzz.png", "html5.png", "i-cursor.png", "icone-grafo-conta.png", "icone-grafo-desconhecido.png", "icone-grafo-email.png", "icone-grafo-empresa-estrangeira.png", "icone-grafo-empresa-fundacao.png", "icone-grafo-empresa-individual.png", "icone-grafo-empresa-publica.png", "icone-grafo-empresa.png", "icone-grafo-endereco.png", "icone-grafo-feminino.png", "icone-grafo-file.png", "icone-grafo-id.png", "icone-grafo-masculino.png", "icone-grafo-telefone.png", "icone-grafo-ug.png", "id-badge.png", "id-card-o.png", "id-card.png", "ils.png", "image.png", "imdb.png", "inbox.png", "indent.png", "industry.png", "info-circle.png", "info.png", "inr.png", "instagram.png", "institution.png", "internet-explorer.png", "intersex.png", "ioxhost.png", "italic.png", "joomla.png", "jpy.png", "jsfiddle.png", "key.png", "keyboard-o.png", "krw.png", "language.png", "laptop.png", "lastfm-square.png", "lastfm.png", "leaf.png", "leanpub.png", "legal.png", "lemon-o.png", "level-down.png", "level-up.png", "life-bouy.png", "life-buoy.png", "life-ring.png", "life-saver.png", "lightbulb-o.png", "line-chart.png", "link.png", "linkedin-square.png", "linkedin.png", "linode.png", "linux.png", "list-alt.png", "list-ol.png", "list-ul.png", "list.png", "location-arrow.png", "lock.png", "long-arrow-down.png", "long-arrow-left.png", "long-arrow-right.png", "long-arrow-up.png", "low-vision.png", "magic.png", "magnet.png", "mail-forward.png", "mail-reply-all.png", "mail-reply.png", "male.png", "map-marker.png", "map-o.png", "map-pin.png", "map-signs.png", "map.png", "mars-double.png", "mars-stroke-h.png", "mars-stroke-v.png", "mars-stroke.png", "mars.png", "maxcdn.png", "meanpath.png", "medium.png", "medkit.png", "meetup.png", "meh-o.png", "mercury.png", "microchip.png", "microphone-slash.png", "microphone.png", "minus-circle.png", "minus-square-o.png", "minus-square.png", "minus.png", "mixcloud.png", "mobile-phone.png", "mobile.png", "modx.png", "money.png", "moon-o.png", "mortar-board.png", "motorcycle.png", "mouse-pointer.png", "music.png", "navicon.png", "neuter.png", "newspaper-o.png", "object-group.png", "object-ungroup.png", "odnoklassniki-square.png", "odnoklassniki.png", "opencart.png", "openid.png", "opera.png", "optin-monster.png", "outdent.png", "pagelines.png", "paint-brush.png", "paper-plane-o.png", "paper-plane.png", "paperclip.png", "paragraph.png", "paste.png", "pause-circle-o.png", "pause-circle.png", "pause.png", "paw.png", "paypal.png", "pencil-square-o.png", "pencil-square.png", "pencil.png", "percent.png", "phone-square.png", "phone.png", "photo.png", "picture-o.png", "pie-chart.png", "pied-piper-alt.png", "pied-piper-pp.png", "pied-piper.png", "pinterest-p.png", "pinterest-square.png", "pinterest.png", "plane.png", "play-circle-o.png", "play-circle.png", "play.png", "plug.png", "plus-circle.png", "plus-square-o.png", "plus-square.png", "plus.png", "podcast.png", "power-off.png", "print.png", "product-hunt.png", "puzzle-piece.png", "python-color.png", "python.png", "qq.png", "qrcode.png", "question-circle-o.png", "question-circle.png", "question.png", "quora.png", "quote-left.png", "quote-right.png", "ra.png", "random.png", "ravelry.png", "rebel.png", "recycle.png", "reddit-alien.png", "reddit-square.png", "reddit.png", "refresh.png", "registered.png", "remove.png", "renren.png", "reorder.png", "repeat.png", "reply-all.png", "reply.png", "resistance.png", "retweet.png", "rmb.png", "road.png", "rocket.png", "rotate-left.png", "rotate-right.png", "rouble.png", "rss-square.png", "rss.png", "rub.png", "ruble.png", "rupee.png", "s15.png", "safari.png", "save.png", "scissors.png", "scribd.png", "search-minus.png", "search-plus.png", "search.png", "sellsy.png", "send-o.png", "send.png", "server.png", "share-alt-square.png", "share-alt.png", "share-square-o.png", "share-square.png", "share.png", "shekel.png", "sheqel.png", "shield.png", "ship.png", "shirtsinbulk.png", "shopping-bag.png", "shopping-basket.png", "shopping-cart.png", "shower.png", "sign-in.png", "sign-language.png", "sign-out.png", "signal.png", "signing.png", "simplybuilt.png", "sitemap.png", "skyatlas.png", "skype.png", "slack.png", "sliders.png", "slideshare.png", "smile-o.png", "snapchat-ghost.png", "snapchat-square.png", "snapchat.png", "snowflake-o.png", "soccer-ball-o.png", "sort-alpha-asc.png", "sort-alpha-desc.png", "sort-amount-asc.png", "sort-amount-desc.png", "sort-asc.png", "sort-desc.png", "sort-down.png", "sort-numeric-asc.png", "sort-numeric-desc.png", "sort-up.png", "sort.png", "soundcloud.png", "space-shuttle.png", "spinner.png", "spoon.png", "spotify.png", "square-o.png", "square.png", "stack-exchange.png", "stack-overflow.png", "star-half-empty.png", "star-half-full.png", "star-half-o.png", "star-half.png", "star-o.png", "star.png", "steam-square.png", "steam.png", "step-backward.png", "step-forward.png", "stethoscope.png", "sticky-note-o.png", "sticky-note.png", "stop-circle-o.png", "stop-circle.png", "stop.png", "street-view.png", "strikethrough.png", "stumbleupon-circle.png", "stumbleupon.png", "subscript.png", "subway.png", "suitcase.png", "sun-o.png", "superpowers.png", "superscript.png", "support.png", "table.png", "tablet.png", "tachometer.png", "tag.png", "tags.png", "tasks.png", "taxi.png", "telegram.png", "television.png", "tencent-weibo.png", "terminal.png", "text-height.png", "text-width.png", "th-large.png", "th-list.png", "th.png", "themeisle.png", "thermometer-0.png", "thermometer-1.png", "thermometer-2.png", "thermometer-3.png", "thermometer-4.png", "thermometer-empty.png", "thermometer-full.png", "thermometer-half.png", "thermometer-quarter.png", "thermometer-three-quarters.png", "thermometer.png", "thumb-tack.png", "thumbs-down.png", "thumbs-o-down.png", "thumbs-o-up.png", "thumbs-up.png", "ticket.png", "times-circle-o.png", "times-circle.png", "times-rectangle-o.png", "times-rectangle.png", "times.png", "tint.png", "toggle-down.png", "toggle-left.png", "toggle-off.png", "toggle-on.png", "toggle-right.png", "toggle-up.png", "trademark.png", "train.png", "transgender-alt.png", "transgender.png", "trash-o.png", "trash.png", "tree.png", "trello.png", "tripadvisor.png", "trophy.png", "truck.png", "try.png", "tty.png", "tumblr-square.png", "tumblr.png", "turkish-lira.png", "tv.png", "twitch.png", "twitter-square.png", "twitter.png", "umbrella.png", "underline.png", "undo.png", "universal-access.png", "university.png", "unlink.png", "unlock-alt.png", "unlock.png", "unsorted.png", "upload.png", "usb.png", "usd.png", "user-circle-o.png", "user-circle.png", "user-md.png", "user-o.png", "user-plus.png", "user-secret.png", "user-times.png", "user.png", "users.png", "vcard-o.png", "vcard.png", "venus-double.png", "venus-mars.png", "venus.png", "viacoin.png", "viadeo-square.png", "viadeo.png", "video-camera.png", "vimeo-square.png", "vimeo.png", "vine.png", "vk.png", "volume-control-phone.png", "volume-down.png", "volume-off.png", "volume-up.png", "warning.png", "wechat.png", "weibo.png", "weixin.png", "whatsapp.png", "wheelchair-alt.png", "wheelchair.png", "wifi.png", "wikipedia-w.png", "window-close-o.png", "window-close.png", "window-maximize.png", "window-minimize.png", "window-restore.png", "windows.png", "won.png", "wordpress.png", "wpbeginner.png", "wpexplorer.png", "wpforms.png", "wrench.png", "xing-square.png", "xing.png", "y-combinator-square.png", "y-combinator.png", "yahoo.png", "yc-square.png", "yc.png", "yelp.png", "yen.png", "yoast.png", "youtube-play.png", "youtube-square.png", "youtube.png"];
graphStore.itensFlag = ["situacao_fiscal", "pep", "ceis", "cepim", "cnep", "acordo_leni\u00eancia", "ceaf", "pgfn-fgts", "pgfn-sida", "pgfn-prev", "servidor_siape"];
graphStore.usuarioLocal = window.location.href.startsWith('http://127.0.0.1')

var defs = null;
var LF = String.fromCharCode(10);
var itensDefault;

	

function dcopy(objetoIn) {
	// substituir por https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
	return JSON.parse(JSON.stringify(objetoIn));
}

function checkImage(imageSrc, fgood, fbad) {
	var img = new Image();
	img.onload = fgood; 
	img.onerror = fbad;
	img.src = imageSrc;
} //.function checkImage
//    checkImage("foo.gif", function(){ console.log("good"); }, function(){ console.log("bad"); } );

function imagemYoutube(urlvideo) {
	//pega miniatura thumbnail do vídeo
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
	var match = urlvideo.match(regExp);
	if  (match&&match[7].length==11) {
		return 'https://img.youtube.com/vi/' + match[7] + '/0.jpg';
	} else {
		return '';
	}
} //.function imagemYoutube

function faviconNoId(noid, urlImage) { 
	let no = graphStore.graph.getNode(noid);
	var imagemAnterior = no.data.imagem;
	var node = graphStore.graphics.getNodeUI(noid);
	var urlAnterior;
	try {
		urlAnterior = node.getElementsByTagName('image')[0].getAttribute('xlink:href');
	} catch (e) {};
	
	/*
	bChecaUrl = true;
	if (!bChecaUrl && !urlImage) {
		if (!imagemAnterior.includes(baseImagem) && !imagemAnterior.startsWith('data:') && !imagemAnterior.startsWith('http')) {
			return;
		}
	}*/
	if (noid.startsWith("LI_https://www.youtube.com/watch?v=")) {
		//nodados.imagem = "https://img.youtube.com/vi/" + idNovo.substr("LI_https://www.youtube.com/watch?v=".length) + '/1.jpg';
		urlImage = imagemYoutube(noid.substr(3)); //youtube.png
		//converter imagens de outro domínio dá erro de permissão nodados.imagem = converteImagem2Base64(nodados.imagem);
	} else if (!urlImage && noid.startsWith('LI_')) {
		var partes = noid.substr(3).split('/');
		if (partes.length>2) {
			urlImage = partes[0]+'/'+partes[1] + '/' + partes[2] + '/favicon.ico';	
		}
	} 
	console.log('yyy');
	console.log(urlImage);

	if (!urlImage) { //não faz nada, não parece ser url
		return;
	}
	
	urlImage2 = urlImage;

	//if (!urlImage.startsWith('http')) {
	if (!urlImage.includes(baseImagem) && !urlImage.startsWith('data:') && !urlImage.startsWith('http')) {
		urlImage2 = baseImagem + urlImage;
	}
	
	if (urlImage2.startsWith(baseImagem)) { //se for imagem do servidor da redecnpj, não busca fora
		no.data.imagem = urlImage;
		node.getElementsByTagName('image')[0].setAttribute('xlink:href', urlImage2);	
		return;
	} 

	checkImage(urlImage, 
		function() {
			no.data.imagem = urlImage;
			let urlaux = urlImage;
			if (!urlImage.includes(baseImagem) && !urlImage.startsWith('data:') && !urlImage.startsWith('http')) {
				urlaux = baseImagem + urlImage;
			}
			node.getElementsByTagName('image')[0].setAttribute('xlink:href', urlaux);
		},
		function () {
			node.getElementsByTagName('image')[0].setAttribute('xlink:href', baseImagem + 'link.png');
		}
	);
} //.function faviconNoId

function embaralhaTexto(t) {
	const shuffle = str => [...str].sort(()=>Math.random()-.5).join('');
	var lista = [];
	for (x of t.split(' ')) {
		var xs = shuffle(x);
		if (xs==x){
			xs = shuffle(x);
		}
		lista.push(xs);
	}
	return lista.join(' ');
} //.function embaralhaTexto


function menu_localiza_CaminhosEntreitensComNotas(criterioCaminhos) {
	if (graphStore.idNosSelecionados.size<=1) {
		var cont = menu_localiza_itensComNotas(false);	
		if (!cont) {
			alertify.error('Para usar esta rotina, deve haver itens com notas.');
			return;
		}
	}
	if (criterioCaminhos) {
		let dicItens = menu_incluirCamada_dicItemNota();
		if (Object.keys(dicItens).length==0) { // (dicItens) { dicItens == true??
			alert('Para usar esta opção de caminhos, os itens devem ter Anotações para identificar os grupos. Para adicionar uma anotação, clique com o botão da roda.');
			return false;
		}
	}
	var camada = prompt('Distância máxima aproximada entre os itens', 2);
	if (camada===null) {
		return;
	}
	camada = parseInt(camada);
	//graphStore.menu_caminhos_na_tela(camada, criterioCaminhos);
	graphStore.menu_caminhos(camada, criterioCaminhos, false) 
} //.function menu_localiza_CaminhosEntreitensComNotas

function listaESeleciona(dcontagem, texto) {
	const listaIdContagem = Object.entries(dcontagem).sort(([,a],[,b]) => b-a);
	var tmaiores = texto + '\n\nN - ID: CONTAGEM\n\n';
	var k=0;
	var listaIds = [];
	for (const element of listaIdContagem) {
		k += 1;
		if (k<=15) {
			tmaiores += '' + k + ' - ' + element[0] + ': ' + element[1] + '\n';
		}
		listaIds.push(element[0]);
		if (k>=100) break;
	}
	tmaiores += '\n\nDeseja selecionar quantos itens?';
	var nids = prompt(tmaiores, Math.min(k,15));
	nids = parseInt(nids);
	if (!nids) return;
	graphStore.selecionaSet(new Set(listaIds.slice(0,nids))); //, listaIds[0]);
	alertify.success('Os itens ' + listaIds.slice(0,nids) + ' foram selecionados');
} //.function listaESeleciona

function menu_localiza_itensLigadosAColoridos() {
	var dcontagem = {};
	var bMudou = false;
	graphStore.graph.forEachLink(function(link){
		var corFrom = graphStore.graph.getNode(link.fromId).data.cor ? 1: 0;
		var corTo = graphStore.graph.getNode(link.toId).data.cor? 1:0 ;
		dcontagem[link.fromId] = dcontagem[link.fromId] ? dcontagem[link.fromId]+corTo : corTo;
		dcontagem[link.toId] = dcontagem[link.toId] ? dcontagem[link.toId]+corFrom : corFrom;
	});
	listaESeleciona(dcontagem, 'Ligados a itens marcados');
} //.function menu_localiza_itensLigadosAColoridos

function menu_localiza_itensComNotas(bMensagem) { 
	var setNos = new Set();
	graphStore.graph.forEachNode( function(node) { 
		if (graphStore.graph.getNode(node.id).data.nota) {
			setNos.add(node.id);
		}
	});
	var cont = graphStore.selecionaSet(setNos);
	if (!bMensagem) {
		return cont;
	}
	if (cont) {
		alertify.success('Foram encontrados ' + cont + ' itens com Notas');
	} else {
		alertify.error('Não foi encontrado item com Nota');
	}
} //.function menu_localiza_itensComNotas

function dadosEmHtmlPJ(d, noData) {
	//for (var i of Object.entries(graphStore.json)) {
	//	texto += '<b>' + i[0] + ':<b> ' + i[1] + '<br> '; }
	var ht = '';
	ht += "<b>CNPJ:</b> " + d['cnpj_formatado'] + " - " + d['matriz_filial'] + "<br>";
	ht += "<b>Razão Social:</b> "+d['razao_social'] +  "<br>";
	ht += "<b>Nome Fantasia:</b> "+d['nome_fantasia'] + "<br>";
	ht += "<b>Data início atividades:</b> "+d['data_inicio_atividades']+"<br>";
	ht += "<b>Situação:</b> "+d['situacao_cadastral']+" <b>Data Situação:</b> "+d['data_situacao_cadastral']+"<br>";
	ht += "<b>Motivo situação:</b> "+d['motivo_situacao_cadastral'] +"<br>";
	ht += "<b>Natureza jurídica:</b> "+d['natureza_juridica'] +"<br>";
	ht += "<b>Porte empresa:</b> "+d['porte_empresa'] +"<br>";
	ht += "<b>Opção MEI:</b> "+d['opcao_mei'] +"<br>";
	ht += "<b>Capital Social:</b> R$ "+d['capital_social'] +"<br>";
	ht += "<b>Endereço:</b> "+d['endereco'] +"<br>";
	if (d['uf']!='EX') {
		ht += "<b>Municipio:</b> "+d['municipio']+"/"+d['uf'] + " - <b>CEP:</b>" + d['cep'] +"<br>";
	} else {
		ht += "<b>Municipio:</b> "+d['municipio']+"<br>";
		ht += "<b>País:</b> "+d['pais']+"<br>";
	}
	ht += "<b>Telefone:</b> "+d['ddd1']+" "+ d['telefone1']+"  "+d['ddd2']+" "+d['telefone2'] +"<br>";
	ht += "<b>Fax:</b> "+d['ddd_fax']+" "+d['fax'] +"<br>";
	ht += "<b>Email:</b> "+d['correio_eletronico'] +"<br>";

	ht += "<b>CNAE:</b> "+d['cnae_fiscal'] +"<br>";
	ht += "<b>CNAE Secundária:</b> "+graphStore.cortastr(d['cnae_secundaria'], 250) +"<br>"; 
	if (noData.nota) {
		ht += "<br><b>Nota:</b> "+ noData.nota + "<br>";
	}
	camposPJ = ['cnpj', 'cnpj_formatado', 'matriz_filial', 'razao_social', 'nome_fantasia', 'data_inicio_atividades', 'situacao_cadastral',
				'data_situacao_cadastral', 'motivo_situacao_cadastral', 'natureza_juridica', 'cnae_fiscal', 'cnae_secundaria', 'porte_empresa', 'opcao_mei',
				'endereco', 'municipio', 'uf', 'cep', 'nm_cidade_exterior', 'nome_pais', 'nm_cidade_exterior', 'pais',
				'ddd1', 'telefone1', 'ddd2', 'telefone2', 'ddd_fax', 'fax', 'correio_eletronico', 'capital_social'
				];
	for (let k of camposPJ) {
		d[k] = '';
	}
	return ht;
} //.dadosEmHtmlPJ

function menu_importarJsonArquivo(evt, tipo) {
	menuStore.menuOnClick();
	if (tipo=='drop') {
		var files = evt.dataTransfer.files;
	} else {
		var files = evt.target.files; // FileList object
	}
	for (var i = 0; i < files.length; i++) {
		//console.log(files[i].name);
		var f=files[i];
		var reader = new FileReader();
		reader.onload = (function(f) {
			return function(e) {
				var contents = e.target.result;
				//alert( "Got the file.n"  +"name: " + f.name + "n"  +"type: " + f.type + "n"  +"size: " + f.size + " bytesn"  + "starts with: " + contents.substr(1, contents.indexOf("n"))); 
				if (f.name.endsWith('.csv')) {
					inserir_lista(contents);
					//console.log(contents);
				} else if (f.name.endsWith('.json')){
					//importaJSON(contents);
					try {
						var content_parse = JSON.parse(contents);
						graphStore.debug = contents;
						graphStore.inserirJson(content_parse, 'Leitura de arquivo. ');
					} catch (e) {
						alertify.error('Aconteceu um erro ' + e);
					}
				} else if (f.name.endsWith('.py')){
					//importaJSON(contents);
					inserir_lista('_>p\n' + contents);
				} else if (f.name.endsWith('.js')){
					//importaJSON(contents);
					inserir_lista('_>j\n' + contents);
				} else {
					var idNovo = 'AR_' + f.name;
					resp = confirm('Exporta arquivo para o servidor?')
					if (resp) {
						exportaArquivoServidor(f);
						//console.log(idNovo); 
					} else {
						graphStore.menu_ligar_novo(idNovo,'');
					}
					/*
					var descricao = prompt('Digite uma descrição para o arquivo ' + f.name, '');
					if (graphStore.graph.hasNode(idNovo)) {
						alert('Já existe um arquivo com o nome ' + f.name);
						
					} else {
						var no = {'id': idNovo,
						   'descricao': descricao,
						   'camada': 0,
						   'situacao_ativa': true,
						   'imagem': graphStore.iconeF(idNovo), //'icone-grafo-id.png',
						   'cor': 'yellow'};					
						};
						graphStore.graph.addNode(idNovo, JSON.parse(JSON.stringify(no)));
					}
					*/
				}
			};
		})(f);
		reader.readAsText(f);
	}
} //.function menu_importarJsonArquivo



function exportaArquivoServidor(arquivo) { 
	//https://stackoverflow.com/questions/5587973/javascript-upload-file
	let formData = new FormData();
	formData.append("arquivo", arquivo);
	fetch(base + 'arquivo_upload/', {method: "POST", body: formData})
		.then(
			function(response) {
			  if (response.status !== 200) {
				graphStore.mensagemErroHttp(response);
				return;
			  }
			  // Examine the text in the response
			  response.json().then(function(data) {
				//console.log(data);
				document.body.style.cursor = 'default';
				if (data.nomeArquivoServidor) {
					console.log('nome '+ data.nomeArquivoServidor); 
					let idNovo = 'AR_' + data.nomeArquivoServidor;
					graphStore.menu_ligar_novo(idNovo,'');
					//return data.nomeArquivoServidor;
				} else {
					alertify.error('Aconteceu um erro. ' + data.mensagem);
				}
			  });
			}
		  )
		  .catch(function(err) {
			document.body.style.cursor = 'default';
			console.log('Fetch Error :-S', err);
			alertify.error('Aconteceu um erro (Fetch error ' + err + ')');
		  });
} //.function exportaArquivoServidor

//function menu_exportaJSONServidor(bSoSelecionados, bMostraAlerta, idArquivoServidor, setNos, nomeNovaAba) {
function menu_exportaJSONServidor(bSoSelecionados, bReescreveNoLink) {
	//abre nova aba exportando dados para o servidor
	//bExportaParaArquivoJson true, o arquivo será salvo no servidor como json, se false vai para o banco de dados local
	//se setNos especificado, usa esses itens para exportar
	//se setNos = null, usa todos os itens do gráfico se bSoSelecionados=false ou só selecionados se bSoSelecionados=true
	
	var jsonDados;
	var novaJanela;
	jsonDados = graphStore.getRedeNosLigacoes(bSoSelecionados);
	if (jsonDados.no.length==0) {
		alertify.error('Não há itens para exportar.');
		return;
	}
	var idArquivoServidor = '';
	
	var url = base + 'arquivos_json_upload/'
	if (bReescreveNoLink) { //xxe
		idArquivoServidor = String(window.location).split('/').pop();
		if (!confirm('o arquivo ' + idArquivoServidor + ' será ATUALIZADO no servidor. A versão anterior não poderá ser recuperada. Deseja prosseguir?')) {
			return;
		}
		url += String(window.location).split('/').pop() + '?reescreve=S';
	} else {
		idArquivoServidor =  prompt('Digite um começo para o nome do arquivo a ser carregado no servidor. Serão adicionados caracteres aleatórios para dificultar o acesso a outros usuários. Qualquer pessoa com o nome + caracteres aleatórios poderá abrir ou apagar o arquivo.', 'rede');
		if (!idArquivoServidor) {
			return;
		}
		url += encodeURIComponent(idArquivoServidor);
	}
	fazFetch(url, jsonDados); 
	function fazFetch(url, jsonDados) {
		document.body.style.cursor = 'wait';
		fetch(url, {method: 'post', body:JSON.stringify(jsonDados), headers: {"Content-type": "application/json"}, cache: "no-store"}) // mode: 'cors',
		  .then(
			function(response) {
			  if (response.status !== 200) {
				graphStore.mensagemErroHttp(response);
				return;
			  }
			  // Examine the text in the response
			  response.json().then(function(data) {
				document.body.style.cursor = 'default';
				if (data.nomeArquivoServidor) {
					if (!bReescreveNoLink) {
						alert('O arquivo foi carregado no servidor com o nome: ' + data.nomeArquivoServidor + '\n' + 'Será aberto uma janela com o link, que poderá ser compartilhado.\nAtenção: QUALQUER PESSOA COM O LINK poderá ABRIR ou APAGAR o arquivo no servidor. \nOs arquivos no servidor PODERÃO SER APAGADOS sem aviso prévio. Faça uma cópia local com a opção no menu Salvar/Abrir>Arquivo>Salvar Arquivo Json.');
						var novaJanela=window.open(base + "grafico_no_servidor/" + data.nomeArquivoServidor);
					} else {
						alert('O arquivo foi carregado no servidor com o nome: ' + data.nomeArquivoServidor + '\nOs arquivos no servidor PODERÃO SER APAGADOS sem aviso prévio. Faça uma cópia local com a opção no menu Salvar/Abrir>Arquivo>Salvar Arquivo Json.');					
					}
				} else {
					alertify.error('Aconteceu um erro. ' + data.mensagem);
					alert('Aconteceu um erro. ' + data.mensagem);
				}
			  });
			}
		  )
		  .catch(function(err) {
			document.body.style.cursor = 'default';
			console.log('Fetch Error :-S', err);
			alertify.error('Aconteceu um erro (Fetch error ' + err + ')');
			alert('Aconteceu um erro (Fetch error ' + err + ')');
		  });
	}
	//return novaJanela; novaJanela só retorna null
} //.function menu_exportaJSONServidor

function menu_importaJSONServidor(idArquivoServidor, bNaoConfirma, bApaga) {
	var resp = null;
	var metodo = 'post';
	if (!idArquivoServidor) {
		if (bApaga) {
			idArquivoServidor =  prompt('Digite o nome do arquivo no JSON no servidor que será carregado e depois APAGADO:');
		} else {
			idArquivoServidor =  prompt('Digite o nome do arquivo no JSON no servidor:');
		}
	}
	if (!idArquivoServidor) {
		return;
	}
	var url = '';
	if (idArquivoServidor.startsWith(base+'grafico_no_servidor/')) {
		idArquivoServidor = idArquivoServidor.substr(base.length+'grafico_no_servidor/'.length);
	} 
	url = base + 'arquivos_json/' + idArquivoServidor;

	if (bApaga) {
		if (!bNaoConfirma) {
			resp = confirm('O arquivo ' + idArquivoServidor + ' será lido do Servidor e depois APAGADO?\nDeseja prosseguir?? NÃO SERÁ POSSÍVEL REVERTER!!!!.');
		}
		if (!resp) {
			return;
		}
		//parametros['apagar']='sim';
		metodo = 'delete';
	}
	//se idArquivoServidor=temporario, o arquivo será apagado do servidor após de ser servido
	fazFetch(url, idArquivoServidor); 
	function fazFetch(url, idArquivoServidor) {
		document.body.style.cursor = 'wait';
		//fetch(url, {method: 'get'}) // mode: 'cors',
		//fetch(url, {method: 'post', headers: {"Content-type": "application/json"}, cache: "no-store"}) // mode: 'cors',
		fetch(url, {method: metodo, body:JSON.stringify({}), headers: {"Content-type": "application/json"}, cache: "no-store"}) // mode: 'cors',
		  .then(
			function(response) {
			  if (response.status !== 200) {
				graphStore.mensagemErroHttp(response);
				alertify.error('Não conseguiu carregar o arquivo ' + idArquivoServidor);
				return;
			  }
			  // Examine the text in the response
			  response.json().then(function(data) {
				//console.log(data);
				document.body.style.cursor = 'default';
				graphStore.inserirJson(data, ' Arquivo do Servidor: ' + idArquivoServidor, bNaoConfirma);
				if (bApaga) {
					alertify.warning('O arquivo ' + idArquivoServidor + ' foi removido do servidor');
				}
			  });
			}
		  )
		  .catch(function(err) {
			document.body.style.cursor = 'default';
			console.log('Fetch Error :-S', err);
			alertify.error('Aconteceu um erro (Fetch error ' + err + ')');
		  });
	}
} //.function menu_importaJSONServidor





function menu_apagaJSONNavegador() {
	var tmensagem = 'Digite nome para apagar no navegador. Os seguintes conjuntos estão na memória: \n';
	var arquivosLocais = JSON.parse(localStorage.getItem('jsons'));
	var ultimoNome = ''
	if (!arquivosLocais || ( Object.keys(arquivosLocais).length==0)) {
		alert('Não há arquivos locais no navegador');
		return;
	}
	for (let nome of Object.keys(arquivosLocais))  {
		tmensagem += nome + '\n';
		ultimoNome = nome;
	}
	tmensagem += '\nOu Use * para apagar todos os arquivos locais.\nNão será possível reverter o apagamento.';
	idArquivo =  prompt(tmensagem, ultimoNome);
	if (!idArquivo) {
		return;
	}
	if (idArquivo=='*') {
		arquivosLocais = {};
	} else {
		delete arquivosLocais[idArquivo];
	}
	localStorage.setItem('jsons', JSON.stringify(arquivosLocais));
} //.function menu_apagaJSONNavegador

function reinsereComNovoId(id, idNovo) { 
	//reinsere nó com outro id, mantendo os dados do nó e das ligações.
	var dados = dcopy(graphStore.graph.hasNode(id)).data;
	var llinks = [];
	graphStore.graph.forEachLinkedNode( id, function(nodeaux, link) { 
		llinks.push(dcopy(link.data));
	});
	//graphStore.graph.removeNode(id);
	//console.log(JSON.stringify(dados)); 
	//console.log(JSON.stringify(llinks));
	var posicao = graphStore.layout.getNodePosition(id);
	graphStore.removeIdNo(id);
	dados.id = idNovo;
	graphStore.graph.addNode(idNovo, dcopy(dados));
	for (let li of llinks) {
		var lix = dcopy(li);
		lix.origem = (lix.origem==id) ? idNovo : lix.origem;
		lix.destino = (lix.destino==id) ? idNovo : lix.destino;
		graphStore.graph.addLink(lix.origem, lix.destino, dcopy(lix));
	}
	graphStore.layout.setNodePosition(idNovo, posicao.x, posicao.y);
} //.function reinsereComNovoId

function menu_incluirCamada_dicItemNota() { //cria um dicionário por nota com lista de itens com essa nota. usado para enviar para o servidor para a rotina de caminhos por nota (extra, intra grupos)
	var dicNotaArray = {};
	for (let idx of graphStore.idNosSelecionados) {
		var nota = graphStore.graph.getNode(idx).data.nota;
		if (nota) {
			if (dicNotaArray[nota]) {
				arrayaux = dicNotaArray[nota];
				arrayaux.push(idx);
				dicNotaArray[nota] = JSON.parse(JSON.stringify(arrayaux));
			} else {
				dicNotaArray[nota] = [idx,];
			}
		}
	}
	return dicNotaArray;
} //.menu_incluirCamada_dicItemNota

function menu_nomeAba() {
	var nome = prompt('Digite o nome para esta aba', document.title);
	if (nome) {
		document.title = nome;
	}
} //.function menu_nomeAba

function pinarNoTemp(idNo, milissegundos) {
	var layout = graphStore.layout;
	//if (!graphStore.idnoSelecionado) {
	//	return;
	//}
	//var no = graphStore.graph.getNode(graphStore.idnoSelecionado);
	var no = graphStore.graph.getNode(idNo);
	if (layout.isNodePinned(no)) {
		return;
	}
	layout.pinNode(no, true); 
	setTimeout(
		function() { 
			layout.pinNode(no, false); 
		}, milissegundos
	); 
} //.function pinarNoTemp

function suspendeZoom(milissegundos) {
	//graphStore.scale = graphStore.graphics.scale;
	//desabilita scale temporariamente (se tiver muitos nós, mexer na escala pode travar o browser
	graphStore.mensagem_alerta_zoom_desativado = 'Aguarde para fazer ZOOM.';
	graphStore.graphics.scale = function(a,b) { 
		//alertify.error('O zoom foi temporariamente desativado. Aguarde alguns segundos.');
		if (graphStore.mensagem_alerta_zoom_desativado) { alertify.error(graphStore.mensagem_alerta_zoom_desativado); };
		graphStore.mensagem_alerta_zoom_desativado = ''; //exibe mensagem só uma vez
		return graphStore.renderer.getTransform().scale; 
	}; 
	setTimeout(
		function() { 
			graphStore.graphics.scale = graphStore.fScale;
		}, milissegundos
	); 
} //.function suspendeZoom

function menu_embaralhaTexto() {
	graphStore.embaralhaRotulo = !graphStore.embaralhaRotulo; 
	graphStore.graph.forEachNode( function(node) {
		var ui=graphStore.graphics.getNodeUI(node.id); 
		var [identificador, nome, nota] = graphStore.labelsNo(node, graphStore.kTipoRotulo);
		ui.getElementsByTagName('tspan')[0].text(identificador);
		ui.getElementsByTagName('tspan')[1].text(nome);
		ui.getElementsByTagName('tspan')[2].text(nota);
	});
	if (graphStore.embaralhaRotulo) { 
		alertify.success('Os novos itens terão a descrição embaralhada');
	} 
} //.function menu_embaralhaTexto

function menu_rotulosPosicao(bTipo) { 
	if (bTipo===null) {
		
	} else if (bTipo) {
		graphStore.btextoEmbaixoIcone=true;
	} else {
		graphStore.btextoEmbaixoIcone=false;
	}
} //.function menu_rotulosPosicao

function removeGalhos(bExibeMensagem) {
	var quantidadeLigacoes;	
	var sNosRemover;	
	var contagem=0;
	if (!confirm('Deseja simplificar o gráfico, mantendo apenas os itens com mais de uma ligação ou que tenha alguma anotação ou cor? Não será possível reverter!!')) {
		return;
	}
	while (true) {
		sNosRemover = new Set();	
		graphStore.graph.forEachNode(function(node) {
			if (node) {
				quantidadeLigacoes = graphStore.graph.getLinks(node.id)? graphStore.graph.getLinks(node.id).length: 0;
				if ((quantidadeLigacoes <= 1) && (node.data.camada != 0) && (!node.data.cor) && (!node.data.nota)) {
					sNosRemover.add(node.id);
				}
			}
		});
		contagem += sNosRemover.size;
		if (sNosRemover.size==0) {
			break;
		}
		sNosRemover.forEach(graphStore.removeIdNo);
	}
	if (bExibeMensagem) {
		if (contagem>0) {
			alertify.success('Foram removidos ' + contagem + ' items.');
		} else {
			alertify.success('Não foram localizados itens para remover.');
		}
	}
} //.function removeGalhos

function menu_selecionaGruposColoridos(bCoresDistintas){ 
	//seleciona os grupos com ao menos dois itens coloridos. Se bCoresDistintas=true, duas cores devem ser distintas (entradas e alvos)
	var conjuntos = graphStore.separaGrupos(0);
	var k = 1;
	if (conjuntos.length==1) {
		alert('O gráfico só tem um grupo conexo.');
		return;
	}
	var lista = [];
	for (let sconj of conjuntos) {
		var cores = new Set();
		let itensColoridosNoSubConjunto = 0;
		for (let idin of sconj) {
			var noData = graphStore.graph.getNode(idin).data;
			if (noData && noData.cor) {
				cores.add(noData.cor);
				itensColoridosNoSubConjunto = itensColoridosNoSubConjunto +1;
			}
		}
		if (itensColoridosNoSubConjunto>=2) {
			if (!bCoresDistintas | (cores.size>=2) ) {
				Array.prototype.push.apply(lista, Array.from(sconj));
			}
		}
	}
	graphStore.selecionaSet(new Set(lista));
	if (lista.length) {
		alertify.success('Os grupos foram selecionados, no total de '+lista.length+' elementos');
	} else {
		if (bCoresDistintas) {
			alertify.error('Não há grupos com cores diferentes');
		} else {
			alertify.error('Não há grupos com mais de um item colorido');
		}
	}	
} //.function menu_selecionaGruposColoridos

//const editarIconeColarImagem = async (e) => {
async function editarIconeColarImagem(e) {
	e.preventDefault();
	try {
		var clipboardItems = typeof navigator?.clipboard?.read === 'function' ? await navigator.clipboard.read() : e.clipboardData.files;
	} catch (error) {
		alertify.error('Não conseguiu ler a área de transferência. Tente pressionar CTRL+V');
		return;
	}
	for (const clipboardItem of clipboardItems) { //só os flavors como image/ aparecem aqui... Deve estar filtrado pelo campo? quando se copia de outra janela EditarImagem, copia aparece como text/html com base64
		let blob;
		if (clipboardItem.type?.startsWith('image/')) {
			// For files from `e.clipboardData.files`.
			blob = clipboardItem;
			// Do something with the blob.
			//appendImage(blob);
			editarColarImagemDoClipboard(blob);
		} else {
			  // For files from `navigator.clipboard.read()`.
			  const imageTypes = clipboardItem.types?.filter(type => type.startsWith('image/'))
			  for (const imageType of imageTypes) {
				blob = await clipboardItem.getType(imageType);
				// Do something with the blob.
				editarColarImagemDoClipboard(blob);
			  }
		}
	}
} //.function editarIconeColarImagem

function editarColarImagemDoClipboard(blob) {
	const reader = new FileReader();
	reader.onload = function (event) {
		const base64 = event.target.result;
		//const img = document.createElement("img");
		var img = document.getElementById('dlgItemEditar_imagem');
		img.src = URL.createObjectURL(blob);
		//document.body.append(img);
		//imageContainer.appendChild(img);
		//console.log(base64);
		graphStore.base64Imagem = base64;
	};
	reader.readAsDataURL(blob);	
} //.function editarColarImagemDoClipboard

function soDigitos(id) {
//usar com cautela, só deixar digitos para verificar cpf/cnpj pode dar resultado incorreto, p. ex: yy12345678901 seria considerado cpf
	return id.replace(/\D+/g, '');
} //.function soDigitos

function isNumeric(texto) {
  var er = /^[0-9]+$/;
  return (er.test(texto.trim()));
} //.function isNumeric

function tipoPresumido(id) {
	// supõe se tiver undercores na terceira posicao, já começa com tipo EN_, PF_ , PJ_, etc
	if (!id) {
		return '';
	}
	if ((id.length>3) && (id.substr(2,1) == '_') && (id.substr(0,2)==id.substr(0,2).toUpperCase()) && (!isNumeric(id.substr(0,2)))) { 
		return id.trim(); 
	}
	//var digitos = soDigitos(id); //problema em usar soDigitos, pode ter letra + 14 ou 11 numeros
	var idlimpo = id.replace(/[\.\-\//]/g, '').trim();
	if (isNumeric(idlimpo) && (idlimpo.length==14)) {
		return 'PJ_' + idlimpo;
	} else if (isNumeric(idlimpo) && (idlimpo.length==11)) { //falta adicionar nome
		return 'PF_' + idlimpo;
	} else {
		return 'ID_' + id.trim();
	}
} //.function tipoPresumido

function alterarItens(dadosNos) {//altera dados do item a partir de lista de dados de nos, corrige elemento visível (nota, cor ou imagem) 
	for (let no of dadosNos) {
		var noid = no['id'];
		var node = graphStore.graph.getNode(noid);
		var ui=graphStore.graphics.getNodeUI(noid); 
		for (const [chave, valor] of Object.entries(no)) {
			if (chave=='id') {
				continue;
			}
			var valorAux = valor.trim();
			if ((chave=='nota') && (valorAux.startsWith('+'))) { //se começar com +, adiciona a nota existente
				valorAux = node.data['nota'] + ' ' + valorAux.substr(1);
			} 
			node.data[chave] = valorAux;
			if (chave=='nota') {
				ui.getElementsByTagName('tspan')[2].text(valorAux);
				if (ui.children[0].tagName=='title') {
					ui.children[0].textContent = graphStore.textoTooltip(node, true);
				}
			} else if (chave=='cor') {
				try {
					ui.getElementsByTagName('rect')[0].setAttribute('fill',valor);
				} catch (e){console.log(e); };		
			} else if (chave=='imagem') {
				var urlImagem = baseImagem + valor;
				if (valor.startsWith('http')) {
					urlImagem = valor;
				}
				try {
					ui.getElementsByTagName('image')[0].setAttribute('xlink:href', urlImagem);
				} catch (e){console.log(e); };				
			}
		}		
	}
} //.function alterarItens

function entrada_hierarquico_pyjs(entrada) {
	var entradaTabs = [];
	var kl = 0;
	var cab = entrada.split('\n')[0];
	//var identadorTabs = true; //trim remove espaços ou tabulação
	var kidentadores = 1;
	var insereNumeroNoId = false; //por default, insere número no id se for código python ou javascript
	var mostraNumero = false;

	if (!cab.startsWith('_>')) {
		console.log('erro.')
		return;
	}
	 //TODO ver se hierarquico vai adicionar nome da coluna

	insereNumeroNoId =  cab.includes('n') || cab.includes('N');
	mostraNumero = cab.includes('n');
	if (cab.includes('j')) {
		//identadorTabs = true;
		insereNumeroNoId = true;
	}
	if (cab.includes('p')) { //python, tabulação com 4 espaços
		//identadorTabs = false;
		kidentadores = 4;
		insereNumeroNoId = true;
	}
	/*
	if (cab.includes('e')) {
		identadorTabs = false;
	}*/
	if (cab.includes('n')) {
		mostraNumero = true;
	}		
	if (cab.search(/\d/g)!=-1) {
		kidentadores = parseInt(cab.match(/\d/g)[0]);
		kidentadores = kidentadores ? kidentadores : 1;
	}

	for (let linha of entrada.split('\n')) {
		if (!entradaTabs.length) {
			entradaTabs.push('_>'); //tabela hierarquica
		} else if (linha.trim()) {
			var recuo = Math.floor((linha.length - linha.trimStart().length)/kidentadores); //supõe PEP, quatro espaços de tabulação
			var linhax = '\t'.repeat(recuo);

			if (insereNumeroNoId) {
				linhax += kl.toString().padStart(4,0);
				if (mostraNumero) {
					linhax += ' ';
				} else {
					linhax += '__';
				}
				linhax += linha.trim();
			} else {
				linhax = linha.trimEnd();
			}
			entradaTabs.push(linhax);
		}
		kl += 1;
	}
	return  entradaTabs.join('\n');	
} //.function entrada_hierarquico_pyjs

function inserir_lista(entrada, bNaoConfirma) {
	//inserir três tipos de lista, dependendo se a primeira célula tiver um ou dois underscores ou sem underscore.
	//sem underscore na primeira célula, colunas A,B,C,D,E, cria ligacoes A->B com descrição de ligação C. D e E são descrições dos identificadores A e B
	//sem underscore, só uma coluna, insere identificadores, pfs ou pjs, só busca dados de cnpj, não adiciona camadas
	//1 underscore na primeira célula, por dupla de colunas (fila). Colunas A,B,C,D, gera ligações A->B, B->C, C->D, considera a primeira linha nome das colunas
	//2 underscores na primeira célula, por dupla de colunas (estrela). Colunas A,B,C,D, gera ligações A->B, A->C, C->D, considere a primeira linha como nome das colunas
	//1 undercore + sharp (_#). Coluna _#A, B, C, altera parametro B ou C do id A
   	
	//var itens = entrada.replace(/\n/g,';');
	var max = 0;
	var lista = [];
	var dadosExtras = [];
	var elems = null;
	entrada = entrada.replaceAll('\r\n', '\n');
	var primeiraLinhaEntrada = entrada.split('\n')[0];
	if (primeiraLinhaEntrada.startsWith('_~') || primeiraLinhaEntrada.startsWith('_>')) { //tipo python, troca espaços por tabs para tipoLista hierarquica
		entrada = entrada_hierarquico_pyjs(entrada);
	}
	for (let linha of entrada.split('\n')){
		elems = linha.split('\t');
		max = Math.max(max, elems.length);
	}

	//var kLinhas = 0;
	var bPrimeiraLinha = true;
	var tipoLista = 'ligacao';
	var itensLinhaAnterior = [];
	var linhaHierarquica = new Array(max);
	var itensLinha = [];
	var cabecalhos;
	
	for (let linha of entrada.split('\n')){
		elems = linha.split('\t');
		elems.map(s => s.trim()); //trim elementos
		if ((elems.join('').trim()=='') || (!linha.trim()) ){
			bPrimeiraLinha=true;
			itensLinhaAnterior = [];
			itensLinha = new Array(elems.length).fill(''); //iniciado só para copiar em itensLInhaAnterior
			linhaHierarquica = new Array(elems.length).fill('');
			continue
		}
		if (bPrimeiraLinha) {
			cabecalhos = JSON.parse(JSON.stringify(elems));
			if (max > cabecalhos.length) {
				var aux = Array(max - cabecalhos.length).fill('');
				cabecalhos = cabecalhos.concat(aux);
			}
			if (cabecalhos[0].startsWith('_+')) {
				tipoLista = 'fila';
			} else if (cabecalhos[0].startsWith('_*')) {
				tipoLista = 'estrela';
			} else if (cabecalhos[0].startsWith('_>')) {
				tipoLista = 'hierarquica';
			} else if (cabecalhos[0].startsWith('_#')) {
				tipoLista = 'alteraDados';
			} else {
				tipoLista = 'ligacao';
				cabecalhos=[];
				bPrimeiraLinha=false;
			}
		}

		if ((tipoLista!='ligacao') && (bPrimeiraLinha)){
			cabecalhos[0] = cabecalhos[0].substr(2);
			bPrimeiraLinha = false;
			continue;
		}
		bPrimeiraLinha = false;		
		var dadosExtrasNo = {};
		if (tipoLista == 'ligacao') { 
			//colunas A,B,C,D,E, cria ligacoes A->B com descrição de ligação C. D e E são descrições dos identificadores A e B
			switch(elems.length) {
				case 0:
					break;
				case 1:
					lista.push([tipoPresumido(elems[0]), '', '', '', '']);
					break;
				case 2:
					lista.push([tipoPresumido(elems[0]), tipoPresumido(elems[1]), '', '', '']);
					break;
				case 3:
					lista.push([tipoPresumido(elems[0]), tipoPresumido(elems[1]), elems[2], '', '']);
					break;
			    case 4: 
					lista.push([tipoPresumido(elems[0]), tipoPresumido(elems[1]), elems[2], elems[3], '']);
					break;
				default:
					lista.push([tipoPresumido(elems[0]), tipoPresumido(elems[1]), elems[2], elems[3], elems[4]]);
			}
		} else if (tipoLista == 'alteraDados') { 
			//colunas _#A,B,C,D,E, altera parametros definidos pelos rótulos B,C,D,E nos elementos da coluna A	
			var idPre = tipoPresumido(elems[0]);
			idPre = tipoPresumido(cabecalhos[0]? cabecalhos[0] + ' ' + elems[0] : elems[0]);	
			dadosExtrasNo['id'] = idPre;
			for (let k=1; k<=elems.length; k++) {
				if (cabecalhos[k]) {
					dadosExtrasNo[cabecalhos[k]] = elems[k];
					lista.push([idPre, '', '', '', '']);
				}
			}
			dadosExtras.push( JSON.parse(JSON.stringify(dadosExtrasNo)) );
		} else {
			//console.log(itensLinha);
			itensLinhaAnterior = JSON.parse(JSON.stringify(itensLinha)); //usado em hierarquica e |

			itensLinha = [];
			
			for (let k=0; k<elems.length; k++) {
				if (cabecalhos[k].startsWith('_-') || !elems[k])  { //ignora essa coluna
					itensLinha.push('');
					continue;
				}
				var cabecalhok = cabecalhos[k];
				if (cabecalhok.startsWith('|')) { //vinculo vertical
					cabecalhok = cabecalhok.substr(1);
					bLigacaoVertical = true;
				} else {
					bLigacaoVertical = false;
				}
				if (cabecalhok.startsWith('$')) { //se $ no nome da coluna, coloca o texto também na ligação
					cabecalhok = cabecalhok.substr(1);
					//nomeLigacao = cabecalhok;
				}

				var idPre = tipoPresumido(elems[k]);
				if (idPre.startsWith('ID_')) {
					idPre = tipoPresumido(cabecalhok? cabecalhok + ' ' + elems[k]:elems[k]);
				}
				itensLinha.push(idPre);
				if (bLigacaoVertical && itensLinhaAnterior[k]) {
					if (itensLinhaAnterior[k]) {
						lista.push([itensLinhaAnterior[k], idPre, '', '', '']);
					}
				}
			}
			//itensLinhaAnterior = JSON.parse(JSON.stringify(itensLinha)); //usado em hierarquica e |
					
			if (tipoLista == 'estrela') { // _* undercore + estrela
				//converte tabela para ligacões, por dupla de colunas (estrela). Colunas A,B,C,D, gera ligações A->B, A->C, C->D
				//se algum rotulo começar com 1 underscores, adiciona o texto como ligacao, senão adiciona nos elementos
				for (let k=1; k<itensLinha.length; k++) {
					var idPre1 = itensLinha[0]; 
					var idPre2 = itensLinha[k];
					if (!idPre1 ||  !idPre2) {
						continue;
					}
					var cabecalhok = cabecalhos[k];
					var nomeLigacao = '';
					if (cabecalhok.startsWith('|')) { //vinculo vertical
						cabecalhok = cabecalhok.substr(1);
					} 
					if (cabecalhok.startsWith('$')) { //se $ no nome da coluna, coloca o texto também na ligação
						cabecalhok = cabecalhok.substr(1);
						nomeLigacao = cabecalhok
					}
					lista.push([idPre1, idPre2, nomeLigacao, '', '']);

				}				
			} else if (tipoLista == 'fila')  { //um underscore + _+
				//converte tabela para ligacões, por dupla de colunas (fila). Colunas A,B,C,D, gera ligações A->B, B->C, C->D
				//se algum rotulo começar com 1 underscores, adiciona o texto como ligacao, senão adiciona nos elementos
				for (let k=0; (k+1)<elems.length; k++) {
					var idPre1 = itensLinha[k]; 
					var idPre2 = itensLinha[k+1];
					if (!idPre1 ||  !idPre2) {
						if (idPre1) {
							lista.push([idPre1, '', '', '', '']);
						}
						if (idPre2) {
							lista.push([idPre2, '', '', '', '']);
						}
						continue;
					}
					var cabecalhok1 = cabecalhos[k+1];
					var nomeLigacao = '';
					if (cabecalhok1.startsWith('|')) { //vinculo vertical
						cabecalhok1 = cabecalhok1.substr(1);
					} 
					if (cabecalhok1.startsWith('$')) { //se $ no nome da coluna, coloca o texto também na ligação
						cabecalhok1 = cabecalhok1.substr(1);
						nomeLigacao = cabecalhok1;
					}
					lista.push([idPre1, idPre2, nomeLigacao, '', '']);
				}
			} else if (tipoLista == 'hierarquica')  { //um underscore >  (_/)

				for (let k=0; k<itensLinha.length; k++) { 
					if (!itensLinha[k]) {
						continue;
					}
					if (k==0) {
						if (linhaHierarquica[0]) {
							lista.push([linhaHierarquica[0], itensLinha[0] , '', '', '']);
						} else if (itensLinhaAnterior[0]) {
							lista.push([itensLinhaAnterior[0], itensLinha[0] , '', '', '']);
						} else {
							lista.push([itensLinha[0],'' , '', '', '']);
						}	
						linhaHierarquica = new Array(max).fill('');
						linhaHierarquica[0] = itensLinha[0];

					} else if (itensLinha[k-1]) {
						lista.push([itensLinha[k-1], itensLinha[k], '<<>>', '', '']);
						for (let m=k; m<linhaHierarquica.length; m++) {
							linhaHierarquica[m] = '';
						}		
						linhaHierarquica[k] = itensLinha[k];				
					} else if (!itensLinha[k-1]) {
						if (itensLinhaAnterior[k]) {
							lista.push([itensLinhaAnterior[k], itensLinha[k], '', '', '']);
							linhaHierarquica[k] = itensLinha[k];
						} else if (itensLinhaAnterior[k-1]) {
							lista.push([itensLinhaAnterior[k-1], itensLinha[k], '<<>>', '', '']);
							linhaHierarquica[k] = itensLinha[k];								
						}  
						else if (linhaHierarquica[k]) {
							lista.push([linhaHierarquica[k], itensLinha[k], '', '', '']);
							linhaHierarquica[k] = itensLinha[k];
						} else { 
							console.log('Algo errado - hierarquica');
						}
					} else {
						alertify.error('Algo errado...');
						console.log('erro:' + itensLinha);
					}
					if (false) {
						for (let m=k+1; m<linhaHierarquica.length; m++) {
								linhaHierarquica[m] = '';
						}
					}
				}
			} else {
				console.log('erro...');
			}
		} 
	}
	
	if (!lista.length) {
		alertify.error('Formato não reconhecido.');
		return;
	}
	var tamanhoGrupo=0;
	if (tipoLista != 'hierarquica') {
		if (ajustarArvore(lista, true, 10)>0){
			tamanhoGrupo = prompt('A lista tem identificadores que não são PJ ou PF repetidos diversas vezes.\nPara facilitar a visualização, pode-se dividir esses identificadores em ramos.\nDigite uma quantidade de itens por ramos ou Cancele para inserir sem ramos.', 10);
		}
		if (tamanhoGrupo) {
			lista = ajustarArvore(lista, false, tamanhoGrupo);
		}
	}
	var nos = [];
	var ligacoes = [];
	var nosid = new Set();
	var cnpjsids = new Set();
	var cnpjDescricao = {};
    for (let linha of lista) {
		var id1 = linha[0]; 
		var id2 = linha[1]; 
		//var id1limpo = id1.replace(/[\.\-\//]/g, '');
		//var id2limpo = id2.replace(/[\.\-\//]/g, '');
		//TODO verificar se sem pontos e virgulas tem 14 dígitos
		if ((!id1) && (!id2)) {
			continue;
		}	
		if (id1.startsWith('PJ_')) {
			cnpjsids.add(id1);
			cnpjDescricao[id1] = linha[3];			
		} else if (id1) {
			let descricaoaux = id1.startsWith('PF_')?id1.substr(15):linha[3];
			if (!nosid.has(id1)) {
				nosid.add(id1);
				nos.push({'id': id1,
			   'descricao': descricaoaux, //linha[3],
			   'camada': 0,
			   //'situacao_ativa': true,
			   'imagem': graphStore.iconeF(id1), //'icone-grafo-id.png',
			   'cor': 'yellow'});
			}
		}
		if (id2.startsWith('PJ_')) {
			cnpjsids.add(id2);
			cnpjDescricao[id2] = linha[4];
		} else if (id2) {
			let descricaoaux = id2.startsWith('PF_')?id2.substr(15):linha[4];
			if (!nosid.has(id2)) {
				nosid.add(id2);
				nos.push({'id': id2,
			   'descricao': descricaoaux, //linha[4],
			   'camada': 0,
			   //'situacao_ativa': true,
			   'imagem': graphStore.iconeF(id2), //'icone-grafo-id.png',
			   'cor': 'yellow'});
			}
		}
	    if ((id1) && (id2)) {
		   ligacoes.push({'origem': id1,
			   'destino': id2,
			   'cor': graphStore.corLigacaoLink, //'green',
			   'camada': 1,
			   'tipoDescricao': '', //'link',
			   'label': linha[2]});
		}
	}
	if (cnpjsids.size) {
		fazFetchCnpjs(cnpjsids, nos, ligacoes);
	} else {
		var noLigacoes = {'no':nos, 'ligacao':ligacoes, 'mensagem':''};
		graphStore.inserirJson(noLigacoes,' drop lista ', bNaoConfirma);
		alterarItens(dadosExtras);
	}
	return;
	/*
    var entradaExemplo = [['ID_a1','ID_a2','l1','nome 1','nome 2'], 
					['ID_a1','ID_a3','l2', 'nome 1', 'nome 3'],
					['ID_a3','ID_a4','l3', 'nome 3', 'nome 4'] ]; */
	function ajustarArvore(lista, bSoConta, kGrupo) {
		//se um ID tiver mais de kGrupo ligacoes, vai quebrando em subarvores de no máximo kGrupo elementos.
		//const kGrupo=10;
		if (!kGrupo) {
			kGrupo=10;
		}
		var contagemIds = {}; //itens que não são cpf/cnpj ou EN_
		//conta elementos ID_ para abrir arvore
		for (let linha of lista) {
			var id1 = linha[0]; 
			if (id1.substr(0,3)=='ID_') {
				if (! contagemIds[id1]) {
					contagemIds[id1] = 0;
				}
				contagemIds[id1] += 1;
			}
		}
		//verifica quais itens tem muita repetição
		var idsArvore = new Set();
		for (let k of Object.keys(contagemIds)) {
			if (contagemIds[k]>kGrupo) {
				idsArvore.add(k);
			}
		}
		if (bSoConta) {
			return idsArvore.size;
		}
		contagemIds = {}; //contagem para loop da lista
		var listaAdicional = [];
		var listaSaida = [];
		for (let linha of lista) {
			let linhaSaida = [...linha];
			var id1 = linha[0]; 
			if (idsArvore.has(id1)) {
				if (!contagemIds[id1]) {
					contagemIds[id1]=0;
				}
				contagemIds[id1] += 1;
				idgrupo = id1 + '(' + String(Math.floor(contagemIds[id1]/kGrupo)+1) + ')';
				if (contagemIds[id1]%kGrupo==1) {
					listaSaida.push([id1, idgrupo,'','','']);
				}
				linhaSaida[0] = idgrupo;
			}
			listaSaida.push(JSON.parse(JSON.stringify(linhaSaida)));
		}
		return listaSaida;
	} //.function ajustarArvore

	function fazFetchCnpjs(cnpjsids, nos, ligacoes) {
		//var idin = [...cnpjsids].join(';');		
		var idinlista = [...cnpjsids];
		document.body.style.cursor = 'wait';
		let bodyjson = JSON.stringify(idinlista);
		var url =  base + 'grafojson/cnpj/0/' + idinlista[0];
		if (idinlista.length>1) {
			url += ' (' + idinlista.length + ' itens)';
		}
		//fetch(url, {method: 'get'}) // mode: 'cors',pos
		fetch(url, {method: 'post', body:  bodyjson, headers: {"Content-type": "application/json"}, cache: "no-store"}) // mode: 'cors',
		  .then(
			function(response) {
			  if (response.status !== 200) {
				graphStore.mensagemErroHttp(response);
				return;
			  }
			  // Examine the text in the response
			  response.json().then(function(data) {
				//console.log(data);
				document.body.style.cursor = 'default';
				for (let n of data['no']) {
					nos.push(JSON.parse(JSON.stringify(n)));
					//todo verificar se todos os cnpjs supostos apareceram
				}
				for (let li of data['ligacao']) {
					ligacoes.push(JSON.parse(JSON.stringify(li)));
				}
				var noLigacoes = {'no':nos, 'ligacao':ligacoes, 'mensagem':''};
				graphStore.inserirJson(noLigacoes,' drop lista ', bNaoConfirma);
				alterarItens(dadosExtras);
			  });
			}
		  )
		  .catch(function(err) {
			document.body.style.cursor = 'default';
			console.log('Fetch Error :-S', err);
			alertify.error('Aconteceu um erro (Fetch error ' + err + ')');
		  });
	} //.function fazFetchCnpjs
} //.function inserir_lista

function menu_editarNota(noid){
	var ui=graphStore.graphics.getNodeUI(noid); 
	var nota = graphStore.graph.getNode(noid).data.nota;
	nota = nota? nota: '';
	graphStore.ativaAtalhos(false);
	var brenderer = graphStore.menu_rendererAtivarParar(false, false);
	var tprompt = 'Digite texto de anotação.';
	if (graphStore.idNosSelecionados.size>1) {
		tprompt += ' Há ' + graphStore.idNosSelecionados.size + ' itens selecionados. O mesmo texto de Nota será aplicado em todos. Não será possível reverter as alterações.'
	}
	alertify.prompt( 'Editar Nota', tprompt, nota
	   , function(evt, texto) { 
			if (!(texto===null)) { 
				for (let nid of graphStore.idNosSelecionados) {
					ui=graphStore.graphics.getNodeUI(nid); 
					ui.getElementsByTagName('tspan')[2].text(texto);
					graphStore.graph.getNode(nid).data.nota = texto;
					try {
						ui.children[0].textContent = graphStore.textoTooltip(graphStore.graph.getNode(nid), true);
					} catch (e){; };
				}
			}
			graphStore.menu_rendererAtivarParar(brenderer, false);
			graphStore.ativaAtalhos(true);
		}, function() { 
			graphStore.ativaAtalhos(true);
			graphStore.menu_rendererAtivarParar(brenderer, false);
	});
} //.function menu_editarNota

function menu_alterarIcone(nomeIcone) { 
	var menuIconeOptions, nomeIcone;
	if (!nomeIcone) {
		var menuIconeOptions = document.getElementById('menu_selecao_icone_options');
		var nomeIcone = menuIconeOptions.value;
	}
	if (nomeIcone) { 
		for (let noid of graphStore.idNosSelecionados) {
			let no = graphStore.graph.getNode(noid);
			no.data.imagem = nomeIcone;
			var node = graphStore.graphics.getNodeUI(noid);
			try {
				node.getElementsByTagName('image')[0].setAttribute('xlink:href', baseImagem + nomeIcone);
			} catch (e){; };
		}		
	} 
	if (menuIconeOptions) {
		menuIconeOptions.value=0; 
	}
} //.function menu_alterarIcone

function saveTextAsFile(textToSave, nomeArquivo, mime) {   //salva arquivo texto sem precisar mandar para o servidor.
	var textToSaveAsBlob = new Blob([textToSave], mime); //{type:"text/plain"});
	var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
	var fileNameToSaveAs = nomeArquivo; 
	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	downloadLink.href = textToSaveAsURL;
	downloadLink.onclick = function (event) {document.body.removeChild(event.target);} ;
	downloadLink.style.display = "none";
	document.body.appendChild(downloadLink);
	downloadLink.click();
} //.function saveTextAsFile


function menu_exportai2(bSoSelecionados) {
	menuStore.menu_exportaArquivo(bSoSelecionados, 'anx');
} //.function menu_exportai2


function menu_salvaJsonArquivo(bSoSelecionados) {
	var redeItens = graphStore.getRedeNosLigacoes(bSoSelecionados);
	if (redeItens.no.length==0) { 
		alertify.error('Não há itens para exportar');
	} else {
		var data1 = new Date(); // toIsoString não corrige timezone
		var datahora = new Date(data1.getTime() - (data1.getTimezoneOffset() * 60000)).toISOString().replaceAll(':','.');
		saveTextAsFile(JSON.stringify(redeItens), 'rede_cnpj-'+datahora+'.json', {type:"application/json"});
	}
} //.function menu_salvaJsonArquivo

function converteImagens2Base64(listaImagens) {
	var dicionarioBase64 = {};
	var c = document.createElement('canvas');
	for (let nomeImagem of listaImagens) {
		var img = new Image();
		img.src = baseImagem + nomeImagem;
		img_home.appendChild(img);
		if (1) {
			c.height = img.naturalHeight;
			c.width = img.naturalWidth;
			var ctx = c.getContext('2d');
			ctx.drawImage(img, 0, 0, c.width, c.height, 0, 0, c.width, c.height);
			var base64String = c.toDataURL();
			dicionarioBase64[nomeImagem] = base64String;
		}
	}
	return dicionarioBase64;
} //.function converteImagens2Base64() 

function getXMLdeSVG() {
	var svg_xml = (new XMLSerializer).serializeToString(document.getElementsByTagName('svg')[0]); 
	//svg_xml = replaceAll(svg_xml,'xmlns:xlink="http://www.w3.org/1999/xlink"',''); //esse link é acrescentado em campo de texto, causando erro no svg
	svg_xml = svg_xml.replaceAll('xmlns:xlink="http://www.w3.org/1999/xlink"',''); //esse link é acrescentado em campo de texto, causando erro no svg
	svg_xml = svg_xml.replace('<svg ', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '); //define namespace para link
	/*
	var listaImagens= [
			'icone-grafo-masculino.png',
			'icone-grafo-feminino.png',
			'icone-grafo-desconhecido.png',
			'icone-grafo-endereco.png',
			'icone-grafo-telefone.png',
			'icone-grafo-email.png',
			'icone-grafo-empresa-publica.png',
			'icone-grafo-empresa-individual.png',
			'icone-grafo-empresa.png',
			'icone-grafo-empresa-fundacao.png',
			'icone-grafo-empresa-estrangeira.png',
			'icone-grafo-id.png' ]; */
	var sImagens = new Set(); //graphStore.listaImagens;
	//verifica quais imagens estão sendo usadas.
	var pedacos = svg_xml.split('xlink:href="' + baseImagem);
	for (let p of pedacos) {
		if (p.indexOf('.png') != -1) {
			var nome = p.split('.png')[0];
			if (nome) {
				sImagens.add(nome+'.png');
			}
		}
	}
	var listaImagens = [...sImagens];
	//ver http://d3export.housegordon.org/ exemplo para exportação svg		
	var dicionario = converteImagens2Base64(listaImagens);
	for (let key of listaImagens) {
		var baseStr=dicionario[key];
		var strProcurar = 'xlink:href="' + baseImagem + key + '"';
		var strSubstituicao = 'xlink:href="'+baseStr + '"';
		//svg_xml = replaceAll(svg_xml, strProcurar, strSubstituicao);
		svg_xml = svg_xml.replaceAll(strProcurar, strSubstituicao);
	}
	return svg_xml;
} //.function getXMLdeSVG()

function menu_exportaSVG() {
	var mime={type:"image/svg"};
	alertify.success("SVG (Scalable Vector Graphics)");
	var data1 = new Date(); // toIsoString não corrige timezone
	var datahora = new Date(data1.getTime() - (data1.getTimezoneOffset() * 60000)).toISOString().replaceAll(':','.');	
	saveTextAsFile(getXMLdeSVG(), 'rede_cnpj-'+datahora+'.svg', mime); 
} //.function menu_exportaSVG

function menu_input_cnpj(elemento) {
    if(event.key === 'Enter') {
		graphStore.inserirDefault = elemento.value;
		var cn = elemento.value.trim().toUpperCase();
		if (isNumeric(cn) && (cn.length==11)) { 
			alertify.warning('A busca por CPF pode apresentar resultados incorretos, pois a tabela de sócios não tem todos os dígitos do identificador.');
		}
		graphStore.menu_incluirCamada(elemento.value, 1);
	}
} //.function menu_input_cnpj

function menu_configurar_nodeSize() {
	var parametro = prompt('Digite o tamanho do ícone.', graphStore.nodeSize);
	if (!parametro) {
		return;
	}
	graphStore.nodeSize = parseInt(parametro);
	//pra funcionar corretamente, é necessário mudar todos os elementos visuais que usam nodeSize, como rect, etc... 
	graphStore.graph.forEachNode( function(node) {
		var ui=graphStore.graphics.getNodeUI(node.id); 
		if (graphStore.btextoEmbaixoIcone) { //se houver items criados com um estado ou outro, pode ficar inconsistente e isso não resolve.
			ui.getElementsByTagName('text')[0].attr('x', graphStore.nodeSize/2).attr('y', String(graphStore.tamanhoFonte*1.1 + graphStore.nodeSize) + 'px');;		
			ui.getElementsByTagName('tspan')[0].attr('x', graphStore.nodeSize/2);		
			ui.getElementsByTagName('tspan')[1].attr('x', graphStore.nodeSize/2);
			ui.getElementsByTagName('tspan')[2].attr('x', graphStore.nodeSize/2);
			ui.getElementsByTagName('image')[0].attr('width', graphStore.nodeSize).attr('height', graphStore.nodeSize);
			ui.getElementsByTagName('rect')[0].attr('width', graphStore.nodeSize).attr('height', graphStore.nodeSize);
			ui.getElementsByTagName('rect')[1].attr('width', graphStore.nodeSize).attr('height', graphStore.nodeSize);
		} else {
			ui.getElementsByTagName('text')[0].attr('x', graphStore.nodeSize).attr('y', graphStore.nodeSize*0.5+graphStore.tamanhoFonte*0.5);;		
			ui.getElementsByTagName('tspan')[0].attr('x', graphStore.nodeSize*1.2);		
			ui.getElementsByTagName('tspan')[1].attr('x', graphStore.nodeSize*1.2);
			ui.getElementsByTagName('tspan')[2].attr('x', graphStore.nodeSize*1.2);
			ui.getElementsByTagName('image')[0].attr('width', graphStore.nodeSize).attr('height', graphStore.nodeSize);
			ui.getElementsByTagName('rect')[0].attr('width', graphStore.nodeSize).attr('height', graphStore.nodeSize);
			ui.getElementsByTagName('rect')[1].attr('width', graphStore.nodeSize).attr('height', graphStore.nodeSize);		
		}
	}); 
} //.function menu_configurar_nodeSize



function balanca() {
//deslocamento para o renderizador atualizar tela, não adianta se renderer estiver parado.
	if (!graphStore.idnoSelecionado) {
		return;
	}
	var position = graphStore.layout.getNodePosition(graphStore.idnoSelecionado);
	graphStore.layout.setNodePosition(noaux.id, position.x+10, position.y+10);
} //.function balanca

function menu_configurar_springCoeff() {
	var parametro = prompt('Digite o coeficiente da "mola" da ligação (valor padrão 0.0002)', graphStore.layout.simulator.springCoeff());
	if (parametro) {
		graphStore.layout.simulator.springCoeff(parametro);
	}
} //.function menu_configurar_springCoeff

function menu_configurar_gravity() {
	var parametro = prompt('Digite o valor da gravidade (valor padrão -1.2)', graphStore.layout.simulator.gravity());
	if (parametro) {
		graphStore.layout.simulator.gravity(parametro);
	}
} //.function menu_configurar_gravity

function menu_configurar_dragCoeff() {
	var parametro = prompt('Digite o coeficiente de arrasto (valor padrão 0.02)', graphStore.layout.simulator.dragCoeff());
	if (parametro) {
		graphStore.layout.simulator.dragCoeff(parametro);
	}
} //.function menu_configurar_dragCoeff

function menu_configurar_theta() {
	var parametro = prompt('Digite do coeficiente theta (valor padrão 0.8)', graphStore.layout.simulator.theta());
	if (parametro) {
		graphStore.layout.simulator.theta(parametro);
	}
} //.function menu_configurar_theta(

//resposta a evento drop no div do menu, para abrir opção de inserção. Por exemplo, arrastar do word ou excel uma lista de cnpjs.
function dragover_handler(ev) {
	ev.preventDefault();
	// Define o dropEffect para ser do tipo move
	ev.dataTransfer.dropEffect = "copy"
} //.function dragover_handler

function drop_handler(ev) {
	ev.preventDefault();
	// Pega o id do alvo e adiciona o elemento que foi movido para o DOM do alvo
	var tipos = ev.dataTransfer.types;
	//console.log(tipos);
	//window.focus(); //não funciona, o focus with no aplicativo de origem da dragagem
	if (tipos.includes("rede_json")) { //recebe botão DRAG de outra aba da rede
		var nosLigacoes = ev.dataTransfer.getData("rede_json"); 
		graphStore.inserirJson(JSON.parse(nosLigacoes), 'Drop. ');
	} else if (tipos.includes("text/x-moz-url")) { //drop link url - funciona no firefox, mas no chrome não aparece esse flavor
		//var data = ev.dataTransfer.getData("text");
		var lista = ev.dataTransfer.getData("text/x-moz-url").split('\n'); //url separado do titulo por linha
		//graphStore.menu_ligar_novo('LI_' + lista[0], lista[1]); 
		//código para tirar duplicação da descrição, mas complica demais.
		var tdescricao = lista[1];
		if (graphStore.labelsNo_LI('LI_' + lista[0], graphStore.tamCorteLabel).toUpperCase()==lista[1].toUpperCase()) { //se id ficar igual a descrição (nome da página), ignora descricao
			tdescricao = '';
		}
		graphStore.menu_ligar_novo('LI_' + lista[0], tdescricao);
	} else if (tipos.includes( "text/uri-list")) { //drop link url- no chrome
		var item = ev.dataTransfer.getData("text/uri-list"); //aqui só tem url, não tem título da página como no firefox
		graphStore.menu_ligar_novo('LI_' + item, '');
	} else if (tipos.includes("text/plain")) {
		var data = ev.dataTransfer.getData("text");
		if (ev.shiftKey) {
		   
		} else {
			inserir_lista(data);
		}
	} else if (tipos.includes("Files")) {
		menu_importarJsonArquivo(ev, 'drop');
	} else {
		alertify.error('Drop. Tipo não reconhecido');
		console.log(tipos);
		return;
	}
} //.function drop_handler





graphStore.main();
graphStore.start();

function onSearch(palavraChave){
    const tipo = 'cnpj';
    const camada = '1';

    graphStore.buscar(tipo, camada, palavraChave)
}
</script>


