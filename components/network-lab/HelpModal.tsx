// components/network-lab/HelpModal.tsx
import React, { useState } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'devices' | 'connections' | 'simulation' | 'export'>('basics');
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white dark:bg-gray-800 p-6">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  ネットワークラボの使い方
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ネットワークラボを使ってネットワーク図を作成し、シミュレーションを実行する方法を説明します。
                  </p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex -mb-px space-x-6 overflow-x-auto">
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'basics'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('basics')}
                >
                  基本操作
                </button>
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'devices'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('devices')}
                >
                  デバイス操作
                </button>
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'connections'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('connections')}
                >
                  接続管理
                </button>
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'simulation'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('simulation')}
                >
                  シミュレーション
                </button>
                <button
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'export'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                  onClick={() => setActiveTab('export')}
                >
                  保存とエクスポート
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6 max-h-96 overflow-y-auto">
              {/* Basic Operations Tab */}
              {activeTab === 'basics' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">ネットワークラボの基本的な操作</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">モード切替</span>: 画面上部の「論理構成図」または「物理構成図」ボタンをクリックして切り替えます。
                      </li>
                      <li>
                        <span className="font-medium">ズーム操作</span>: キャンバス左上のズームコントロールを使用するか、マウスホイールでズームイン・アウトできます。
                      </li>
                      <li>
                        <span className="font-medium">キャンバス移動</span>: スペースを空クリックしたままドラッグするとキャンバス全体を移動できます。
                      </li>
                      <li>
                        <span className="font-medium">グリッド表示</span>: 左側のグリッドアイコンをクリックするとグリッド表示のオン/オフができます。
                      </li>
                      <li>
                        <span className="font-medium">グリッドスナップ</span>: 左側のスナップアイコンをクリックすると、デバイスがグリッドに自動的に整列します。
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">キーボードショートカット</h4>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">Delete</span>
                        <span>選択したアイテムを削除</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Ctrl+Z</span>
                        <span>元に戻す</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Ctrl+Y</span>
                        <span>やり直し</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Ctrl+S</span>
                        <span>JSONとして保存</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Escape</span>
                        <span>接続モードをキャンセル</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">+/-</span>
                        <span>ズームイン・アウト</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Devices Tab */}
              {activeTab === 'devices' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">デバイスの追加と管理</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">デバイス追加</span>: 左側のデバイスライブラリからデバイスを選択し、キャンバスにドラッグ&ドロップするか、クリックして追加します。
                      </li>
                      <li>
                        <span className="font-medium">デバイス選択</span>: デバイスをクリックすると選択され、右側のプロパティパネルで編集できます。
                      </li>
                      <li>
                        <span className="font-medium">デバイス移動</span>: デバイスをドラッグして移動できます。スナップがオンの場合はグリッドに合わせて配置されます。
                      </li>
                      <li>
                        <span className="font-medium">デバイス設定</span>: デバイスを選択し、プロパティパネルの「設定」ボタンをクリックすると詳細設定が可能です。
                      </li>
                      <li>
                        <span className="font-medium">デバイス削除</span>: デバイスを選択し、Deleteキーを押すか、プロパティパネルの「削除」ボタンをクリックします。
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">デバイスタイプ</h4>
                    <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">ルーター</p>
                        <p className="text-gray-700 dark:text-gray-300">ネットワーク間のルーティングを行うデバイス。IPアドレス、ルーティングテーブル、VLANなどの設定が可能。</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">スイッチ</p>
                        <p className="text-gray-700 dark:text-gray-300">ネットワーク内の接続を提供するデバイス。VLAN、ポート設定などが可能。</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">ファイアウォール</p>
                        <p className="text-gray-700 dark:text-gray-300">ネットワークセキュリティを提供するデバイス。アクセス制御、NAT設定が可能。</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">サーバー/ワークステーション</p>
                        <p className="text-gray-700 dark:text-gray-300">エンドポイントデバイス。IPアドレス、サブネット、ゲートウェイなどの設定が可能。</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Connections Tab */}
              {activeTab === 'connections' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">デバイス間の接続作成と管理</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">接続作成</span>: デバイスを選択し、右側のプロパティパネルからポートを選択して「接続」をクリックし、接続先のデバイスのポートをクリックします。または、デバイスのポートをクリックしてから、接続先のポートをクリックします。
                      </li>
                      <li>
                        <span className="font-medium">接続キャンセル</span>: 接続作成中にEscキーを押すとキャンセルできます。
                      </li>
                      <li>
                        <span className="font-medium">接続選択</span>: 接続線をクリックすると選択され、プロパティパネルで編集できます。
                      </li>
                      <li>
                        <span className="font-medium">接続経路編集</span>: 接続を選択し、プロパティパネルの「経路編集」ボタンをクリックすると、接続経路にポイントを追加して形状を調整できます。
                      </li>
                      <li>
                        <span className="font-medium">接続削除</span>: 接続を選択し、Deleteキーを押すか、プロパティパネルの「削除」ボタンをクリックします。
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">VLAN管理</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">VLAN作成</span>: 上部メニューの「VLAN管理」ボタンをクリックし、VLANを追加・編集できます。
                      </li>
                      <li>
                        <span className="font-medium">ポートへのVLAN割り当て</span>: デバイスを選択し、プロパティパネルの「ポート」タブでVLANを割り当てられます。または、デバイス設定画面のVLANタブで設定できます。
                      </li>
                      <li>
                        <span className="font-medium">VLANの削除</span>: VLAN管理画面で該当するVLANの削除ボタンをクリックします。
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Simulation Tab */}
              {activeTab === 'simulation' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">シミュレーションの実行</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">シミュレーション開始</span>: 上部メニューの「シミュレーション開始」ボタンをクリックします。
                      </li>
                      <li>
                        <span className="font-medium">シミュレーション停止</span>: 「シミュレーション停止」ボタンをクリックします。
                      </li>
                      <li>
                        <span className="font-medium">コンソール表示</span>: シミュレーション中のログや実行結果を表示するには「コンソール」ボタンをクリックします。
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">Ping テスト</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">Ping実行</span>: シミュレーション実行中にデバイスを選択し、プロパティパネルの「Ping」セクションでターゲットデバイスを選択して「Ping」ボタンをクリックします。
                      </li>
                      <li>
                        <span className="font-medium">結果確認</span>: Pingテストの結果はコンソールに表示されます。また、成功した場合はパケットの経路がアニメーションで表示されます。
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">トラブルシューティング</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">IPアドレス確認</span>: デバイスのIPアドレスとサブネットマスクが正しく設定されていることを確認します。
                      </li>
                      <li>
                        <span className="font-medium">ルーティング確認</span>: ルーターのルーティングテーブルが正しく設定されていることを確認します。
                      </li>
                      <li>
                        <span className="font-medium">VLAN確認</span>: スイッチのVLAN設定とポート割り当てが正しいことを確認します。
                      </li>
                      <li>
                        <span className="font-medium">接続状態確認</span>: デバイス間の接続が正常に確立されていることを確認します。
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Export Tab */}
              {activeTab === 'export' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">保存とエクスポート</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">JSONエクスポート</span>: 上部メニューの「エクスポート」ボタンをクリックし、「JSONとして保存」を選択します。これにより、後で読み込むことができるファイルが作成されます。
                      </li>
                      <li>
                        <span className="font-medium">PDFエクスポート</span>: 「PDFとして保存」を選択すると、現在のネットワーク図をPDFとして保存できます。
                      </li>
                      <li>
                        <span className="font-medium">CSV設定エクスポート</span>: 「CSV設定エクスポート」を選択すると、すべてのデバイスの設定情報をCSVとして保存できます。
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white">インポート</h4>
                    <ul className="mt-2 list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                      <li>
                        <span className="font-medium">JSONインポート</span>: 上部メニューの「インポート」ボタンをクリックし、以前にエクスポートしたJSONファイルを選択します。
                      </li>
                      <li>
                        <span className="font-medium">テンプレートインポート</span>: 「テンプレートインポート」ボタンをクリックすると、事前定義されたデバイステンプレートを選んでインポートできます。
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:px-6 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;