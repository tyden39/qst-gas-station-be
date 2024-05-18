const Invoice = require("../models/Invoice.model")

class InvoiceService {
  async createInvoice(data) {
    return await Invoice.create(data);
  }

  async getInvoiceById(id) {
    return await Invoice.findByPk(id);
  }

  async getInvoices(filter) {
    const where = {};

    if (filter.name) {
      where.name = { [Op.like]: `%${filter.name}%` };
    }
    if (filter.email) {
      where.email = { [Op.like]: `%${filter.email}%` };
    }

    return await Invoice.findAll({ where });
  }

  async updateInvoice(id, data) {
    const invoice = await Invoice.findByPk(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return await Invoice.update(data);
  }

  async deleteInvoice(id) {
    const Invoice = await Invoice.findByPk(id);
    if (!Invoice) {
      throw new Error('Invoice not found');
    }
    return await Invoice.destroy();
  }
}

module.exports = InvoiceService
