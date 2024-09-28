export async function terminateDB() {
  const kv = await Deno.openKv();
  await deletionDenoKvTemplate(kv, "activeProfile");
  await deletionDenoKvTemplate(kv, "activeSSHKey");
  await deletionDenoKvTemplate(kv, "userName:");
  await deletionDenoKvTemplate(kv, "sshKeyName:");
  await deletionDenoKvTemplate(kv, "OldUsername");
  kv.close();
}

async function deletionDenoKvTemplate(kv: Deno.Kv, key: string): Promise<void> {
  const iterator = kv.list({ prefix: [key] });
  const batch = kv.atomic();

  for await (const entry of iterator) {
    batch.delete(entry.key);
  }

  await batch.commit();
}
