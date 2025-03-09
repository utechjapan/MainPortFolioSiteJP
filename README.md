# UTechLab - Modern Blog & Portfolio Template

# UTechLab - 井ノ原力のポートフォリオ & ブログサイト

現役ITインフラエンジニアとして制作した個人ポートフォリオ兼技術ブログサイトです。Next.js、Tailwind CSS、MDXを活用し、ITインフラとネットワークの専門知識を発信しています。

![サイトイメージ](./public/images/TemplateSample.jpg)

## サイトの特徴

- 🎨 **モダンなダークテーマデザイン** - ITコンテンツに最適化
- 📱 **完全レスポンシブ** - スマホ用ナビゲーション対応
- ✍️ **MDXベースのブログ** - シンタックスハイライト機能付き
- 📑 **自動目次生成** - ブログ記事の見出し対応
- 💬 **Giscusコメント統合** - GitHub Discussionsベース
- 🔍 **検索機能** - ブログ記事の全文検索
- 📂 **カテゴリー別ブラウジング** - コンテンツ管理の効率化
- 🏷️ **タグフィルタリング** - 関連コンテンツの発見性向上
- 📧 **メールニュースレター購読** - 読者との関係構築
- 🔄 **ライト/ダークモード切替** - 閲覧環境に合わせた表示
- 📊 **タイムラインベースのポートフォリオ** - 職務経歴の視覚化

## 私について

私は自治体向けネットワークとサーバーインフラの構築・運用に携わる現役システムエンジニアです。CCNA、LPIC、AWS認定クラウドプラクティショナーなどの資格を取得し、特にCisco製ネットワーク機器、監視ツール、Windows/Linuxサーバーの運用に強みを持っています。

このサイトでは、実務経験を通じて得た知見、特にインフラ構築のベストプラクティス、監視システム設計、クラウド技術活用などについて発信しています。

## 主なコンテンツ

- **技術ブログ**: インフラ、ネットワーク、サーバー運用に関する実践的な記事
- **ポートフォリオ**: これまでの職務経歴と技術スキル
- **自己紹介**: 経歴と専門分野の詳細
- **問い合わせ**: SNSリンクや連絡先情報

## 技術スタック

- **フロントエンド**: Next.js, React, TypeScript
- **スタイリング**: Tailwind CSS, Framer Motion
- **コンテンツ**: MDX, rehype/remark プラグイン
- **デプロイ**: Vercel
- **その他**: Giscus (コメント), メールマガジン連携

## ローカル開発環境のセットアップ

### 必要条件

- Node.js 14.x以上
- npm または yarn

### インストール手順

リポジトリをクローン:

```
git clone https://github.com/yourusername/my-portfolio-blog.git
cd my-portfolio-blog
```

依存パッケージのインストール:

```
npm install
# または
yarn install
```

開発サーバーの起動:

```
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてサイトを確認できます。

## カスタマイズ

### サイト設定

主な設定ファイルは `lib/siteConfig.ts` にあります。以下の項目をカスタマイズできます:

- サイトタイトルと説明
- 著者情報
- ナビゲーションリンク
- コンテンツカテゴリ
- SNSリンク
- コメント設定
- ニュースレター設定

**設定例:**

```typescript
export const siteConfig = {
  title: 'UTechLab',
  description: 'ITインフラとネットワーク技術の専門サイト',
  siteUrl: 'https://www.your-domain.com',
  
  // 著者情報
  author: {
    name: '井ノ原力',
    avatar: '/images/profile.jpg',
    bio: 'インフラエンジニア・自宅サーバー愛好家',
  },
  
  // その他の設定...
}
```

### ブログ記事の追加

`content/blog` ディレクトリに `.mdx` ファイルを追加することでブログ記事を作成できます。各記事は以下のようなフロントマターを含めます:

```md
---
title: 記事タイトル
date: '2025-03-01'
description: 記事の簡単な説明
image: /images/blog/your-cover-image.jpg
tags: ['homelab', 'docker', 'self-hosted']
---

マークダウン形式で本文を記述します。**太字**、*斜体*などのフォーマットが使えます。

## 見出しは自動的に目次に表示されます

シンタックスハイライト付きのコードブロック:

```bash
npm install my-package
```
```

## デプロイ

### Vercelへのデプロイ

1. GitHubにリポジトリをプッシュします。
2. Vercelにアクセスし、リポジトリをインポートします。
3. **Deploy** をクリックします。

### Netlifyへのデプロイ

1. GitHubにリポジトリをプッシュします。
2. Netlifyにアクセスし、**New site from Git** を選択します。
3. リポジトリを選択し、**Deploy site** をクリックします。

## お問い合わせ

サポートが必要な場合は、[chikara.inohara@utechjapan.net](mailto:chikara.inohara@utechjapan.net) までお気軽にご連絡ください。

---

UTechLabをご利用いただきありがとうございます！