<template>
  <div class='card btn btn-info control-remote col-lg-12'>
    <div class='content'>
      <div class='row'>
        <div class='col-lg-2'>
          <span>
            <img :src="'static/img/vitabox/'+warningCard.sensor+'.svg'" width='40' height='40'>
          </span>
        </div>
        <div class='col-lg-10'>
          <div class='numbers'>
            <p>{{warningCard.measure}}</p>
            {{warningCard.location}}
          </div>
         <b></b>
        </div>
      </div>
      <div class='content'>
        <chart-gauge-item-ranges
          :id="warningCard.idchart"
          :chartid="warningCard.idchart"
          :typechartdonut="false"
          :valueChart="warningCard.avg"
          :labelChart="''"
          :chartmaxA="warningCard.threshold_max_acceptable"
          :chartmaxP="warningCard.threshold_max_possible"
          :chartminA="warningCard.threshold_min_acceptable"
          :chartminP="warningCard.threshold_min_possible"
          :symbol="warningCard.symbol"
        ></chart-gauge-item-ranges>
      </div>
      <div class='footer text-center'>
        <hr/>
          <i :class='warningCard.footerIcon'> {{warningCard.dateupdate}}</i>
    </div>
  </div>
</template>
<script>
import ChartGaugeItemRanges from 'components/UIComponents/Charts/chartGaugeItemRanges.vue'
export default {
  components: {
    ChartGaugeItemRanges
  },
  name: 'Warning',
  data() {
    return {
      warningCard: {}
    }
  },
  props: {
    warningCard: {
      type: Object,
      required: true
    }
  },
  mounted() {}
}
</script>
<style>
</style>
