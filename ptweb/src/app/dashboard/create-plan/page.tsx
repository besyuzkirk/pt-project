"use client";

import { ClipboardList, Plus, Save, ArrowLeft, Dumbbell, Apple } from "lucide-react";
import Link from "next/link";

export default function CreatePlanPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer">
              <ArrowLeft size={20} />
            </div>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white">Plan Hazırla</h2>
            <p className="text-sm text-slate-500">Antrenman veya Beslenme programı oluşturun</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-primary" style={{ width: 'auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
            Taslak Olarak Kaydet
          </button>
          <button className="btn-primary" style={{ width: 'auto' }}>
            <Save size={20} />
            Planı Yayınla
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Left Section: Student & Basic Info */}
        <div style={{ width: '350px' }} className="space-y-6">
          <div className="form-card">
            <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-wider">Hedef Seçimi</h3>
            <div className="form-group">
              <label className="form-label">Danışan</label>
              <select className="select-field">
                <option>Caner Yıldız</option>
                <option>Merve Demir</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Plan Türü</label>
              <div className="flex gap-2">
                <button className="flex-1 p-3 rounded-xl bg-primary/20 border border-primary/30 text-primary flex flex-col items-center gap-2">
                  <Dumbbell size={20} />
                  <span className="text-[10px] font-bold uppercase">Antrenman</span>
                </button>
                <button className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10 text-slate-500 flex flex-col items-center gap-2 hover:border-white/20 transition-all">
                  <Apple size={20} />
                  <span className="text-[10px] font-bold uppercase">Beslenme</span>
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Plan Süresi (Hafta)</label>
              <select className="select-field">
                <option>4 Hafta</option>
                <option>8 Hafta</option>
                <option>12 Hafta</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Section: Content Editor */}
        <div className="flex-1 space-y-6">
          <div className="form-card" style={{ maxWidth: 'none' }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Antrenman İçeriği</h3>
              <button className="flex items-center gap-2 text-sm font-bold text-primary px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
                <Plus size={18} /> Antrenman Günü Ekle
              </button>
            </div>

            {/* Mock Exercise Item */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">01</div>
                  <h4 className="font-bold text-white">Göğüs & Triceps Günü</h4>
                </div>
                <button className="text-xs font-bold text-error">Günü Sil</button>
              </div>

              <div className="table-container" style={{ marginTop: '0', background: 'transparent', border: 'none' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{ paddingLeft: '0' }}>Egzersiz</th>
                      <th>Set</th>
                      <th>Tekrar</th>
                      <th>Dinlenme</th>
                      <th style={{ textAlign: 'right' }}>İşlem</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ paddingLeft: '0' }} className="font-semibold text-sm">Bench Press (Barbell)</td>
                      <td><input type="text" className="input-field" style={{ padding: '0.5rem', textAlign: 'center', width: '50px' }} defaultValue="4" /></td>
                      <td><input type="text" className="input-field" style={{ padding: '0.5rem', textAlign: 'center', width: '50px' }} defaultValue="12" /></td>
                      <td><input type="text" className="input-field" style={{ padding: '0.5rem', textAlign: 'center', width: '80px' }} defaultValue="90sn" /></td>
                      <td style={{ textAlign: 'right' }}><button className="p-2 text-slate-500 hover:text-error transition-colors"><Plus size={16} style={{ transform: 'rotate(45deg)' }} /></button></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <button className="w-full py-3 rounded-xl border border-dashed border-white/10 text-slate-500 text-xs font-bold hover:border-white/20 hover:text-slate-400 transition-all">
                + Egzersiz Ekle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
