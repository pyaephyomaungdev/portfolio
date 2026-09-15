import { useRef } from "react";
import { Upload } from "lucide-react";
import type { Profile } from "../../../types/portfolio";

interface ProfileSectionProps {
  profile: Profile;
  onChange: (updated: Profile) => void;
  onUploadAvatar: (file: File) => void;
  isUploadingAvatar: boolean;
}

export function ProfileSection({
  profile,
  onChange,
  onUploadAvatar,
  isUploadingAvatar,
}: ProfileSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Profile & Biography</h2>
        <p className="text-xs text-muted mt-0.5">Core identity, avatar, contact links, and bio.</p>
      </div>

      {/* Avatar Card */}
      <div className="p-4 rounded-xl border border-rule bg-paper flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="relative shrink-0">
          <img
            src={profile.avatarUrl || "/avatar.jpg"}
            alt={profile.name}
            className="h-20 w-20 rounded-full border-2 border-rule object-cover bg-white"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/avatar.jpg";
            }}
          />
          <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-accent border-2 border-white" />
        </div>

        <div className="flex-1 space-y-2 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase text-muted font-medium">Avatar Image</span>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    onUploadAvatar(file);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="inline-flex items-center gap-1.5 rounded-lg border border-rule bg-white px-3 py-1 text-xs font-medium text-ink hover:border-ink transition cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>{isUploadingAvatar ? "Uploading..." : "Upload Photo"}</span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ ...profile, avatarUrl: "/avatar.jpg" })}
                className="rounded-lg border border-rule bg-white px-2.5 py-1 text-xs font-medium text-muted hover:text-ink transition cursor-pointer"
              >
                Default
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Enter image URL (e.g. /avatar.jpg or https://...)"
            value={profile.avatarUrl || ""}
            onChange={(e) => onChange({ ...profile, avatarUrl: e.target.value })}
            className="w-full rounded-lg border border-rule bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-ink font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Full Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => onChange({ ...profile, name: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Handle / Username</label>
          <input
            type="text"
            value={profile.handle}
            onChange={(e) => onChange({ ...profile, handle: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Headline</label>
          <input
            type="text"
            value={profile.headline || ""}
            onChange={(e) => onChange({ ...profile, headline: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Location</label>
          <input
            type="text"
            value={profile.location || ""}
            onChange={(e) => onChange({ ...profile, location: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Public Email</label>
          <input
            type="email"
            value={profile.emailPublic || ""}
            onChange={(e) => onChange({ ...profile, emailPublic: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">GitHub URL</label>
          <input
            type="url"
            value={profile.githubUrl || ""}
            onChange={(e) => onChange({ ...profile, githubUrl: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">Website URL</label>
          <input
            type="url"
            placeholder="https://..."
            value={profile.websiteUrl || ""}
            onChange={(e) => onChange({ ...profile, websiteUrl: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Buy Me a Coffee Link / URL
          </label>
          <input
            type="url"
            placeholder="https://www.buymeacoffee.com/yourname"
            value={profile.buyMeACoffeeUrl || ""}
            onChange={(e) => onChange({ ...profile, buyMeACoffeeUrl: e.target.value })}
            className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink font-mono"
          />
          <span className="text-xs text-muted mt-1 block">
            Used across project pages whenever "Buy Me a Coffee" is enabled for that project.
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-muted mb-1">Bio</label>
        <textarea
          rows={3}
          value={profile.bio || ""}
          onChange={(e) => onChange({ ...profile, bio: e.target.value })}
          className="w-full rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-ink resize-y"
        />
      </div>
    </div>
  );
}
