// src/event/__tests__/event.service.spec.ts
import mongoose, { Model } from 'mongoose';
import { EventService } from '../event.service';
import {
  closeInMemoryMongo,
  connectInMemoryMongo,
} from '../../../../test/setup';
import {
  EventDocument,
  Events,
  EventSchema,
} from '../../../schemas/event.schema';

describe('EventService', () => {
  let service: EventService;
  let eventModel: Model<EventDocument>;

  beforeAll(async () => {
    await connectInMemoryMongo();
    eventModel = mongoose.model<Events>(
      'Events',
      EventSchema,
    ) as Model<EventDocument>;
    service = new EventService(eventModel);

    await eventModel.create({
      _id: new mongoose.Types.ObjectId('64f06cfa8f4c3b2b1a2e1f33'),
      name: 'Initial Event',
      maxQuantity: 100,
      issued: 0,
      editingUserId: null,
      editingExpiresAt: null,
    });
  });

  afterAll(async () => {
    await closeInMemoryMongo();
  });

  it('should edit event and lock editing', async () => {
    await service.requestEdit('64f06cfa8f4c3b2b1a2e1f33', {
      userId: 'user1',
      email: 'user1',
      role: 'admin',
    });
    await service.update(
      '64f06cfa8f4c3b2b1a2e1f33',
      { name: 'Updated Event' },
      { userId: 'user1', email: 'user1', role: 'admin' },
    );

    const result = await eventModel.findOne({
      _id: '64f06cfa8f4c3b2b1a2e1f33',
    });

    expect(result).toBeDefined();
    expect(result?.name).toBe('Updated Event');
    expect(result?.editingUserId).toBe('user1');
    expect(result?.editingExpiresAt).toBeDefined();
  });

  it('should release editing lock', async () => {
    await service.releaseEdit('64f06cfa8f4c3b2b1a2e1f33', {
      userId: 'user1',
      email: 'user1',
      role: 'admin',
    });

    const result = await eventModel.findOne({
      _id: '64f06cfa8f4c3b2b1a2e1f33',
    });

    expect(result).toBeDefined();
    expect(result?.editingUserId).toBeNull();
    expect(result?.editingExpiresAt).toBeNull();
  });

  it('should maintain editing lock', async () => {
    await service.requestEdit('64f06cfa8f4c3b2b1a2e1f33', {
      userId: 'user1',
      email: 'user1',
      role: 'admin',
    });

    await service.update(
      '64f06cfa8f4c3b2b1a2e1f33',
      { name: 'Updated Event' },
      { userId: 'user1', email: 'user1', role: 'admin' },
    );

    await service.maintainEdit('64f06cfa8f4c3b2b1a2e1f33', {
      userId: 'user1',
      email: 'user1',
      role: 'admin',
    });

    const result = await eventModel.findOne({
      _id: '64f06cfa8f4c3b2b1a2e1f33',
    });

    expect(result).toBeDefined();
    expect(result?.editingUserId).toBe('user1');
    expect(result?.editingExpiresAt).toBeDefined();
  });

  it('should throw if another user is editing and lock not expired', async () => {
    const expireTime = new Date(Date.now() + 5 * 60 * 1000);
    await eventModel.updateOne(
      { _id: '64f06cfa8f4c3b2b1a2e1f33' },
      { editingUserId: 'user2', editingExpiresAt: expireTime },
    );

    await expect(
      service.requestEdit('64f06cfa8f4c3b2b1a2e1f33', {
        userId: 'user1',
        email: 'user1',
        role: 'admin',
      }),
    ).rejects.toThrow('Event not found or already being edited');
  });

  it('should allow edit if previous lock expired', async () => {
    const expiredTime = new Date(Date.now() - 5 * 60 * 1000); // -5 phút
    await eventModel.updateOne(
      { _id: '64f06cfa8f4c3b2b1a2e1f33' },
      { editingUserId: 'user2', editingExpiresAt: expiredTime },
    );

    const result = await service.requestEdit('64f06cfa8f4c3b2b1a2e1f33', {
      userId: 'user1',
      email: 'user1',
      role: 'admin',
    });

    expect(result).toBeDefined();
    expect(result.editingUserId).toBe('user1');
  });

  it('should throw if user is not the one editing during maintainEdit', async () => {
    await eventModel.updateOne(
      { _id: '64f06cfa8f4c3b2b1a2e1f33' },
      {
        editingUserId: 'user2',
        editingExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    );

    await expect(
      service.maintainEdit('64f06cfa8f4c3b2b1a2e1f33', {
        userId: 'user1',
        email: 'user1',
        role: 'admin',
      }),
    ).rejects.toThrow('Event not found or already being edited');
  });

  it('should throw if editing non-existent event', async () => {
    await expect(
      service.update(
        '000000000000000000000000',
        { name: 'Invalid Event' },
        {
          userId: 'user1',
          email: 'user1',
          role: 'admin',
        },
      ),
    ).rejects.toThrow('Bạn không có quyền chỉnh sửa hoặc phiên đã hết hạn');
  });
});
