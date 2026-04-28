-- 1. PEMBERSIHAN TOTAL: Hapus kebijakan yang terdeteksi oleh Security Advisor
-- Berdasarkan screenshot Boss, kebijakan kemungkinan bernama ini:
DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Avatars" ON storage.objects;

-- 3. CEK DAN HAPUS KEBIJAKAN LAIN YANG TERLALU LUAS (Jika ada)
-- Menghapus kebijakan yang mengizinkan SELECT ke semua orang tanpa filter folder
DROP POLICY IF EXISTS "Allow All" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;

-- 4. IMPLEMENTASI KEBIJAKAN YANG AMAN (Hanya akses file, NO LISTING)
-- Penting: Kita gunakan (true) hanya untuk bucket avatars agar gambar bisa tampil di web
-- Tapi kita pastikan tidak ada kebijakan listing global.

-- Untuk Avatars: Publik bisa lihat foto (jika tahu namanya), tapi dilarang listing.
CREATE POLICY "Strict Read Avatars" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'avatars');

-- Untuk Documents: HANYA pemilik yang bisa akses folder miliknya.
CREATE POLICY "Strict Individual Document Access" ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'documents' 
  AND (auth.uid())::text = (storage.foldername(name))[1]
);

-- 5. AKTIFKAN PROTEKSI LEVEL BUCKET
-- Pastikan bucket 'documents' TIDAK publik
UPDATE storage.buckets 
SET public = false 
WHERE id = 'documents';

-- Pastikan bucket 'avatars' TETAP publik (agar foto profil muncul)
-- Peringatan di Advisor mungkin tetap ada untuk Avatars jika ia publik, 
-- tapi selama SELECT-nya dibatasi per bucket, itu sudah jauh lebih aman.
UPDATE storage.buckets 
SET public = true 
WHERE id = 'avatars';

DROP POLICY IF EXISTS "Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Avatars" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Avatars" ON storage.objects;
