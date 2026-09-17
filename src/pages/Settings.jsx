import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/entityServices';
import { useToast } from '../context/ToastContext';
import { 
  Tv, 
  Bell, 
  Send, 
  Save, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Sliders,
  Radio,
  ExternalLink
} from 'lucide-react';

const NOTIFICATION_PRESETS = [
  {
    label: "New Notes",
    title: "🚀 New Study Notes Uploaded!",
    message: "Check out the latest notes added to your course. Open the app now to download!"
  },
  {
    label: "App Update",
    title: "⭐ App Update Available",
    message: "A new version of Kodeburner is out! Update now for new features and bug fixes."
  },
  {
    label: "Exam Alert",
    title: "📝 Important Exam Alert!",
    message: "Important notification regarding upcoming exams or syllabus changes."
  }
];

export const Settings = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingNotif, setSendingNotif] = useState(false);

  // AdMob Settings
  const [admobEnabled, setAdmobEnabled] = useState(true);
  const [admobAppId, setAdmobAppId] = useState('ca-app-pub-8809150709763708~5894086200');
  const [admobBannerId, setAdmobBannerId] = useState('ca-app-pub-8809150709763708/4260271790');
  const [admobInterstitialId, setAdmobInterstitialId] = useState('ca-app-pub-8809150709763708/5482937512');
  const [admobRewardedId, setAdmobRewardedId] = useState('ca-app-pub-8809150709763708/7829104821');
  const [admobAppOpenId, setAdmobAppOpenId] = useState('ca-app-pub-8809150709763708/1938204918');

  // OneSignal Settings
  const [onesignalAppId, setOnesignalAppId] = useState('8400945b-3ed3-4cdc-abf8-5b7a9e79a362');
  const [onesignalApiKey, setOnesignalApiKey] = useState('');

  // Push Notification Form
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifUrl, setNotifUrl] = useState('');
  const [notifImage, setNotifImage] = useState('');

  const fetchSettings = () => {
    setLoading(true);
    settingsService.getSettings()
      .then((res) => {
        if (res.success && res.data) {
          const d = res.data;
          setAdmobEnabled(d.admob_enabled === '1' || d.admob_enabled === true);
          if (d.admob_app_id) setAdmobAppId(d.admob_app_id);
          if (d.admob_banner_id) setAdmobBannerId(d.admob_banner_id);
          if (d.admob_interstitial_id) setAdmobInterstitialId(d.admob_interstitial_id);
          if (d.admob_rewarded_id) setAdmobRewardedId(d.admob_rewarded_id);
          if (d.admob_app_open_id) setAdmobAppOpenId(d.admob_app_open_id);
          if (d.onesignal_app_id) setOnesignalAppId(d.onesignal_app_id);
          if (d.onesignal_rest_api_key) setOnesignalApiKey(d.onesignal_rest_api_key);
        }
      })
      .catch((err) => {
        toast.error(err.message || 'Failed to load app settings.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        admob_enabled: admobEnabled ? '1' : '0',
        admob_app_id: admobAppId.trim(),
        admob_banner_id: admobBannerId.trim(),
        admob_interstitial_id: admobInterstitialId.trim(),
        admob_rewarded_id: admobRewardedId.trim(),
        admob_app_open_id: admobAppOpenId.trim(),
        onesignal_app_id: onesignalAppId.trim(),
        onesignal_rest_api_key: onesignalApiKey.trim()
      };

      const res = await settingsService.updateSettings(payload);
      if (res.success) {
        toast.success('App AdMob & OneSignal settings updated successfully!');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast.error('Notification Title and Message are required.');
      return;
    }

    setSendingNotif(true);
    try {
      const payload = {
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        url: notifUrl.trim(),
        image_url: notifImage.trim()
      };

      const res = await settingsService.sendNotification(payload);
      if (res.success) {
        toast.success('Push notification broadcasted to all active app users!');
        setNotifTitle('');
        setNotifMessage('');
        setNotifUrl('');
        setNotifImage('');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to broadcast push notification.');
    } finally {
      setSendingNotif(false);
    }
  };

  const loadTestAdUnits = () => {
    setAdmobBannerId('ca-app-pub-3940256099942544/6300978111');
    setAdmobInterstitialId('ca-app-pub-3940256099942544/1033173712');
    setAdmobRewardedId('ca-app-pub-3940256099942544/5224354917');
    setAdmobAppOpenId('ca-app-pub-3940256099942544/9257390728');
    toast.info('Loaded Google AdMob official sample test unit IDs.');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Sliders size={14} /> Application Controls
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">AdMob Ads & OneSignal Push Config</h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage real-time mobile ad units, global ad toggles, and broadcast push notifications to Android users.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors border border-slate-700"
        >
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Settings Form */}
        <form onSubmit={handleSaveSettings} className="lg:col-span-7 space-y-6">
          {/* AdMob Configuration Card */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  <Tv size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Google AdMob Configuration</h3>
                  <p className="text-xs text-slate-400">Manage real-time Ad Unit IDs fetched by the mobile app</p>
                </div>
              </div>

              {/* Master Ads Switch */}
              <div className="flex items-center gap-3 bg-slate-950/60 px-3.5 py-1.5 rounded-xl border border-slate-800">
                <span className="text-xs font-semibold text-slate-300">
                  {admobEnabled ? 'Ads Active' : 'Ads Disabled'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={admobEnabled}
                    onChange={(e) => setAdmobEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  AdMob Application ID
                </label>
                <input
                  type="text"
                  value={admobAppId}
                  onChange={(e) => setAdmobAppId(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                  placeholder="ca-app-pub-8809150709763708~5894086200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Banner Ad Unit ID
                  </label>
                  <input
                    type="text"
                    value={admobBannerId}
                    onChange={(e) => setAdmobBannerId(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                    placeholder="ca-app-pub-8809150709763708/4260271790"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Interstitial Ad Unit ID
                  </label>
                  <input
                    type="text"
                    value={admobInterstitialId}
                    onChange={(e) => setAdmobInterstitialId(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                    placeholder="ca-app-pub-8809150709763708/5482937512"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Rewarded Ad Unit ID
                  </label>
                  <input
                    type="text"
                    value={admobRewardedId}
                    onChange={(e) => setAdmobRewardedId(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                    placeholder="ca-app-pub-8809150709763708/7829104821"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    App Open Ad Unit ID
                  </label>
                  <input
                    type="text"
                    value={admobAppOpenId}
                    onChange={(e) => setAdmobAppOpenId(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                    placeholder="ca-app-pub-8809150709763708/1938204918"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={loadTestAdUnits}
                  className="text-xs text-orange-400 hover:text-orange-300 underline font-medium cursor-pointer"
                >
                  Use Google Sample Test Ad Unit IDs
                </button>
              </div>
            </div>
          </div>

          {/* OneSignal Configuration Card */}
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Radio size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">OneSignal Push Notification Credentials</h3>
                <p className="text-xs text-slate-400">Used by the Android client and admin broadcast server</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  OneSignal App ID
                </label>
                <input
                  type="text"
                  value={onesignalAppId}
                  onChange={(e) => setOnesignalAppId(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                  placeholder="8400945b-3ed3-4cdc-abf8-5b7a9e79a362"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  OneSignal REST API Key (Required for Broadcasts)
                </label>
                <input
                  type="password"
                  value={onesignalApiKey}
                  onChange={(e) => setOnesignalApiKey(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                  placeholder="Paste OneSignal REST API Key (e.g. os_v2_app_...)"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Found in your OneSignal Dashboard &gt; Settings &gt; Keys &amp; IDs.
                </p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50"
          >
            {saving ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
            Save &amp; Deploy App Settings
          </button>
        </form>

        {/* Push Notification Broadcast Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Send Push Notification</h3>
                <p className="text-xs text-slate-400">Broadcast real-time alert to all student devices</p>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="mb-2 space-y-2">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {NOTIFICATION_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setNotifTitle(preset.title);
                        setNotifMessage(preset.message);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-600/20 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 text-xs font-medium rounded-lg border border-slate-700 transition-all"
                    >
                      {preset.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setNotifTitle('');
                      setNotifMessage('');
                      setNotifUrl('');
                      setNotifImage('');
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-medium rounded-lg border border-slate-800 transition-all"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notification Title *
                </label>
                <input
                  type="text"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. 🚀 New Semester 3 Notes Uploaded!"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Notification Body Message *
                </label>
                <textarea
                  rows={3}
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  placeholder="e.g. Check out the latest Operating Systems question bank and solutions."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Launch URL (Optional)
                </label>
                <input
                  type="url"
                  value={notifUrl}
                  onChange={(e) => setNotifUrl(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  placeholder="https://kodeburner.com/notes"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={notifImage}
                  onChange={(e) => setNotifImage(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-orange-500"
                  placeholder="https://example.com/banner.jpg"
                />
              </div>

              <button
                type="submit"
                disabled={sendingNotif}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {sendingNotif ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
                Send Live Broadcast Alert
              </button>
            </form>
          </div>

          {/* Quick Help Card */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Dynamic Mobile Sync Active
            </div>
            <p>
              When changes are saved, mobile Android devices automatically fetch the updated AdMob IDs upon launching, ensuring seamless remote monetization management without republishing the APK.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
