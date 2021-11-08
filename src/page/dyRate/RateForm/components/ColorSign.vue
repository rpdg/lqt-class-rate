<template>
	<section class="popSection2">
		<span style="vertical-align: sub; margin-right: 1em;">颜色识别</span>
		<van-button plain hairline size="mini" class="btnGreenBorder">已填</van-button>
		<van-button plain hairline size="mini" class="btnBlueBorder">未填</van-button>
		<van-button plain hairline size="mini" class="btnRedBorder">弃填</van-button>
	</section>
</template>
<script>
import { Button } from "vant";
export default {
  components: {
    [Button.name]: Button
  }
};
</script>
<style scoped>
.btnRedBorder {
  border-color: #ed561b;
  color: #ed561b;
  padding: 0 1em;
}

.btnGreenBorder {
  border-color: #54b331;
  color: #54b331;
  padding: 0 1em;
}

.btnBlueBorder {
  border-color: #0093dd;
  color: #0093dd;
  padding: 0 1em;
}

</style>
