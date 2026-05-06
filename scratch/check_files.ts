
import { createAdminClient } from '../src/utils/supabase/admin';

async function checkFiles() {
    const supabase = await createAdminClient();
    const filesToCheck = [
        { bucket: 'documents', path: 'uploads/1777361707865-IMG5766.jpeg' },
        { bucket: 'quick_apply', path: 'photos/1777716014358_Bayu.webp' },
        { bucket: 'quick_apply', path: 'passports/1777716012802_KTP.webp' }
    ];

    console.log("--- Supabase File Existence Check ---");
    for (const file of filesToCheck) {
        const { data, error } = await supabase.storage.from(file.bucket).list(file.path.split('/').slice(0, -1).join('/'), {
            search: file.path.split('/').pop()
        });
        
        const exists = data && data.length > 0;
        console.log(`[${file.bucket}] ${file.path} -> ${exists ? "EXISTS" : "NOT FOUND"}`);
    }
}

checkFiles();
