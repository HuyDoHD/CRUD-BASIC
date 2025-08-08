import { Schema } from 'mongoose';
import { diffObjects } from './utils/diff.util';
import { AuditEnqueue } from './audit-enqueue.service';
import { getRequestContext } from 'src/common/context/request-context';
import { AuditAction } from 'src/schemas/audit.schema';

type PluginOptions = {
  modelName: string;
  blacklist?: string[]; // fields to ignore by default
};

export function auditPlugin(schema: Schema, options: PluginOptions) {
  const blacklist = new Set(options.blacklist || ['__v', 'updatedAt', 'createdAt', 'password', 'salt']);

  schema.pre('save', function (next) {
    (this as any).__isNewDoc = this.isNew;
    if (!this.isNew) {
      (async () => {
        try {
          const orig = await (this as any).constructor.findById((this as any)._id).lean();
          (this as any).__orig = orig;
        } catch (e) {
          // ignore
        } finally {
          next();
        }
      })();
    } else {
      next();
    }
  });

  schema.post('save', function (doc) {
    (async () => {
      try {
        const ctx = getRequestContext();
        const performedBy = ctx.user ? { id: ctx.user.id, email: ctx.user.email } : undefined;
        const ip = ctx.ip;
        const ua = ctx.userAgent;

        if ((this as any).__isNewDoc) {
          const changed = diffObjects({}, doc.toObject(), { blacklist: Array.from(blacklist) });
          console.log(changed)
          await AuditEnqueue.enqueue({
            action: AuditAction.CREATE,
            collectionName: options.modelName,
            documentId: doc._id?.toString() || '',
            changedFields: changed,
            performedBy,
            ipAddress: ip,
            userAgent: ua,
            timestamp: new Date().toISOString(),
          });
        } else {
          const oldVal = (this as any).__orig || {};
          const changed = diffObjects(oldVal, doc.toObject(), { blacklist: Array.from(blacklist) });
          if (Object.keys(changed).length > 0) {
            await AuditEnqueue.enqueue({
              action: AuditAction.UPDATE,
              collectionName: options.modelName,
              documentId: doc._id?.toString() || '',
              changedFields: changed,
              performedBy,
              ipAddress: ip,
              userAgent: ua,
              timestamp: new Date().toISOString(),
            });
          }
        }
      } catch (err) {
        // swallow - never throw to app flow
        console.error('audit plugin post save error', err);
      }
    })();
  });

  schema.pre(['findOneAndUpdate', 'updateOne', 'findOneAndReplace'], async function (next) {
    try {
      const query = (this as any).getQuery();
      const orig = await (this as any).model.findOne(query).lean();
      (this as any).__orig = orig;
    } catch (e) {
      // ignore
    } finally {
      next();
    }
  });

  schema.post(['findOneAndUpdate', 'updateOne', 'findOneAndReplace'], async function (res) {
    try {
      const ctx = getRequestContext();
      const performedBy = ctx.user ? { id: ctx.user.id, email: ctx.user.email } : undefined;
      const ip = ctx.ip;
      const ua = ctx.userAgent;

      let newDoc = res;
      if (!newDoc || !newDoc._id) {
        let id = (this as any).__orig?._id || (this as any).getQuery()?._id;
        if (id) {
          newDoc = await (this as any).model.findById(id).lean();
        } else {
          const q = (this as any).getQuery();
          newDoc = await (this as any).model.findOne(q).lean();
        }
      } else if (newDoc.toObject) {
        newDoc = newDoc.toObject();
      }
      const oldDoc = (this as any).__orig || {};
      const docId = newDoc?._id?.toString() || oldDoc?._id?.toString();
      const changed = diffObjects(oldDoc, newDoc, { blacklist: Array.from(blacklist) });
      if (Object.keys(changed).length > 0) {
        await AuditEnqueue.enqueue({
          action: AuditAction.UPDATE,
          collectionName: options.modelName,
          documentId: docId,
          changedFields: changed,
          performedBy,
          ipAddress: ip,
          userAgent: ua,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('audit plugin post findOneAndUpdate error', err);
    }
  });

  schema.post('findOneAndDelete', async function (doc) {
    try {
      if (!doc) return;
      const ctx = getRequestContext();
      const performedBy = ctx.user ? { id: ctx.user.id, email: ctx.user.email } : undefined;
      const ip = ctx.ip;
      const ua = ctx.userAgent;

      const changed = diffObjects(doc.toObject(), {}, { blacklist: Array.from(blacklist) });
      await AuditEnqueue.enqueue({
        action: AuditAction.DELETE,
        collectionName: options.modelName,
        documentId: doc._id?.toString(),
        changedFields: changed,
        performedBy,
        ipAddress: ip,
        userAgent: ua,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('audit plugin post findOneAndDelete error', err);
    }
  });
}
