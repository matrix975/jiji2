import TableModel      from "../widgets/table-model"
import NumberFormatter from "../utils/number-formatter"
import DateFormatter   from "../utils/date-formatter"
import Deferred        from "../../utils/deferred"

class Loader {
  constructor( positionService, backtestId="rmt", status=null ) {
    this.backtestId = backtestId;
    this.status     = status;
    this.positionService = positionService;
  }
  load( offset, limit, sortOrder) {
    return this.positionService.fetchPositions(
      offset, limit, sortOrder, this.backtestId, this.status);
  }
  count() {
    const d = new Deferred();
    this.positionService.countPositions(this.backtestId, this.status).then(
      (result) => d.resolve(result.count) );
    return d;
  }
}

class PositionModel {

  constructor(position) {
    for (let i in position) {
      if (i === "closingPolicy") {
        this[i] = new ClosingPolicyModel(position[i]);
      } else {
        this[i] = position[i];
      }
    }
  }

  get formatedProfitOrLoss() {
    return NumberFormatter.insertThousandsSeparator(this.profitOrLoss);
  }
  get formatedSellOrBuy() {
    if (this.sellOrBuy === "sell") {
      return "売";
    } else {
      return "買";
    }
  }
  get formatedUnits() {
    return NumberFormatter.insertThousandsSeparator(this.units);
  }
  get formatedEntryPrice() {
    return NumberFormatter.insertThousandsSeparator(this.entryPrice);
  }
  get formatedExitPrice() {
    return this.exitPrice ?
      NumberFormatter.insertThousandsSeparator(this.exitPrice) : "-";
  }
  get formatedEnteredAt() {
    return DateFormatter.format(this.enteredAt);
  }
  get formatedExitedAt() {
    return this.exitedAt ? DateFormatter.format(this.exitedAt) : "";
  }
}

class ClosingPolicyModel {
  constructor(policy) {
    if (policy) for (let i in policy) {
      this[i] = policy[i];
    }
  }
  get formatedTakeProfit() {
    return this.takeProfit ?
      NumberFormatter.insertThousandsSeparator(this.takeProfit) : "-";
  }
  get formatedLossCut() {
    return this.lossCut ?
      NumberFormatter.insertThousandsSeparator(this.lossCut) : "-";
  }
}

export default class PositionsTableModel extends TableModel {
  constructor( pageSize, defaultSortOrder, positionService) {
    super( defaultSortOrder, pageSize );
    this.defaultSortOrder = defaultSortOrder;
    this.positionService = positionService;
    this.selectedPosition = null;
  }

  initialize(backtestId="rmt", status=null) {
    super.initialize(new Loader(this.positionService, backtestId, status));
  }

  loadItems() {
    this.selectedPosition = null;
    super.loadItems();
  }

  convertItems(items) {
    return items.map((item) => this.convertItem(item));
  }

  convertItem(item) {
    return new PositionModel(item);
  }

  set selectedPosition( position ) {
    this.setProperty("selectedPosition", position);
  }
  get selectedPosition( ) {
    return this.getProperty("selectedPosition");
  }

}
