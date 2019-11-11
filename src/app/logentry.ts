export const LogType = {
    add: 'Add Coins',
    sub: 'Subtract Coins',
    batch: 'Batch Add Coins',
    create: 'Create Patron',
    edit: 'Edit Patron',
    del: 'Delete Patron',
    order: 'Order Art',
    fin: 'Finished Order',
    misc: 'Misc.',
};

export interface LogEntry {
    date: string;
    action: string;
    info: string;
}
